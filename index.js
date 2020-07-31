import * as wasm from 'wasm-example';
import Papa from 'papaparse';
import {nest} from 'd3-collection';
import {sum} from 'd3-array';


function generateRandomNumbers() {
    let numbers = [];

    for (let i = 1; i < 10000000; i++) {
        numbers.push(Math.floor(Math.random() * Math.floor(1000000)))
    }

    return numbers;
}

window.simpleSort = function simpleSort() {
    let jsNumbers = generateRandomNumbers();

    const rustNumbers = wasm.Sorting.new();

    const t0 = performance.now();
    console.log('Sorting in Rust started...')
    rustNumbers.sort();
    const t1 = performance.now();
    console.log(`Sorting in Rust took ${t1 - t0} milliseconds.`);

    const t2 = performance.now();
    console.log('Sorting in JS started...')
    jsNumbers.sort();
    const t3 = performance.now();
    console.log(`Sorting in JS took ${t3 - t2} milliseconds.`);
}

window.sortWithCopy = function sortWithCopy() {

    simpleSort();

    const newNumbers = generateRandomNumbers();

    const t4 = performance.now();
    console.log('Sorting in Rust with copying started...')
    wasm.sort_with_copying(newNumbers);
    const t5 = performance.now();
    console.log(`Sorting in Rust with copying took ${t5 - t4} milliseconds.`);
}

window.readFile = async function readFile(file) {

    const t1 = performance.now();

    console.log('CSV processing JS started...')

    const text = await file.text();
    const parsedText = Papa.parse(text, {header: true, dynamicTyping: true});

    const t3 = performance.now();
    console.log(`CSV processing JS took ${t3 - t1} milliseconds.`);

    const summarizedData = nest()
        .key(data => data.country)
        .key(data => data.itemType)
        .rollup((data) => {
            return sum(data, data => data.unitsSold)
        })
        .entries(parsedText.data)
        .map(data => {
            const v = data.values.filter(d => d.key === 'Cosmetics')[0];
            return {country: data.key, total: v === undefined ? 0 : v.value}
        })
        .sort((a, b) => {
            if (a.total > b.total) {
                return -1;
            } else if (a.total < b.total) {
                return 1;
            } else {
                return 0;
            }
        });
    // const t2 = performance.now();
    // console.log(`CSV processing JS took ${t2 - t1} milliseconds.`);

    const itemListElement = document.getElementById('item-list');

    summarizedData.forEach(data => {
        const item = document.createElement("div")
        item.textContent = `${data.country} : ${data.total}`;
        itemListElement.appendChild(item);
    })
}

window.readFileWithRust = async function readFileWithRust(file) {

    const t1 = performance.now();
    console.log('CSV processing Rust started...')

    const text = await file.arrayBuffer();
    const data = new Uint8Array(text);

    const country = wasm.parse_csv_data_u8(data);

    let finalData = {};

    country.forEach(c => {
        const [key, value] = c;
        finalData[key] = value;
    });

    console.log(finalData)

    const t2 = performance.now();
    console.log(`CSV processing Rust took ${t2 - t1} milliseconds.`);

}

window.readFileWithRustAndStore = async function readFileWithRust(file) {

    const logMessage = 'CSV processing with storage in Rust';
    console.time(logMessage);

    const textFromCsvFile = new Uint8Array(await file.arrayBuffer());
    const parsedDataStore = wasm.SalesRecordStore.new();
    parsedDataStore.parse_csv_and_store_records(textFromCsvFile);
    const values = parsedDataStore.get_top_ten_items_by_country('Meat');
    console.log(values);

    console.timeEnd(logMessage);
}
