extern crate serde_derive;
extern crate web_sys;

use std::iter::FromIterator;
use std::str;

use rand::{self, Rng};
use wasm_bindgen::__rt::std::collections::{HashMap};
use wasm_bindgen::prelude::*;
use web_sys::console;
use flate2::write::{DeflateEncoder};
use std::io::prelude::*;
use flate2::Compression;

mod utils;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(a: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub struct Sorting {
    numbers: Vec<u32>
}

#[wasm_bindgen]
impl Sorting {
    pub fn new() -> Sorting {
        let mut nums: Vec<u32> = vec![];
        let mut rng = rand::thread_rng();

        for _n in 1..10000000 {
            nums.push(rng.gen_range(1, 1000000))
        }

        Sorting {
            numbers: nums
        }
    }

    pub fn sort(mut self) {
        self.numbers.sort_unstable()
    }
}

#[wasm_bindgen]
pub fn sort_with_copying(numbers: &JsValue) -> Vec<u32> {
    let mut num: Vec<u32> = numbers.into_serde().unwrap();
    num.sort_unstable();
    num
}

#[wasm_bindgen]
pub struct SalesRecord {
    country: String,
    item_type: String,
    sales_channel: String,
    order_id: u64,
    units_sold: u32,
}

#[wasm_bindgen]
pub struct SalesRecordStore {
    sales_records: Vec<SalesRecord>
}

#[wasm_bindgen]
impl SalesRecordStore {
    pub fn new() -> SalesRecordStore {
        utils::set_panic_hook();
        SalesRecordStore {
            sales_records: vec![]
        }
    }

    pub fn parse_csv_and_store_records(&mut self, csv_text: &[u8]) {
        let mut csv_reader = csv::Reader::from_reader(csv_text);
        let mut raw_record = csv::ByteRecord::new();

        while csv_reader.read_byte_record(&mut raw_record).expect("Failed to read csv input") {
            let country = str::from_utf8(&raw_record[1]).unwrap().to_string();
            let item_type = str::from_utf8(&raw_record[2]).unwrap().to_string();
            let sales_channel = str::from_utf8(&raw_record[3]).unwrap().to_string();

            let order_id_string = str::from_utf8(&raw_record[6]).unwrap().to_string();
            let order_id: u64 = order_id_string.parse::<u64>().unwrap_or_else(|_| panic!("Failed to convert string {} to number", order_id_string));

            let units_sold_string = str::from_utf8(&raw_record[8]).unwrap().to_string();
            let units_sold: u32 = units_sold_string.parse::<u32>().unwrap_or_else(|_| panic!("Failed to convert string {} to number", units_sold_string));

            self.sales_records.push(SalesRecord { country, item_type, sales_channel, order_id, units_sold })
        }
    }

    pub fn get_top_ten_items_by_country(&self, item_type: &str) -> JsValue {
        let mut sumarrized_data: HashMap<String, u32> = HashMap::new();

        for sales_record in self.sales_records.iter() {
            if sales_record.item_type.eq(item_type) {
                *sumarrized_data.entry(sales_record.country.to_string()).or_insert(0) += sales_record.units_sold;
            }
        }
        let mut sorted_values = Vec::from_iter(sumarrized_data);
        sorted_values.sort_by(|&(_, a), &(_, b)| b.cmp(&a));

        JsValue::from_serde(&sorted_values[0..10]).unwrap()
    }
}

#[wasm_bindgen]
pub fn parse_csv_data_u8(csv_text: &[u8]) -> JsValue {
    utils::set_panic_hook();
    let mut csv_reader = csv::Reader::from_reader(csv_text);
    let mut sumarrized_data: HashMap<String, u32> = HashMap::new();

    let mut raw_record = csv::ByteRecord::new();

    while csv_reader.read_byte_record(&mut raw_record).expect("Failed to read csv input") {
        if &raw_record[2] == b"Cosmetics" {
            let units_sold_string = std::str::from_utf8(&raw_record[8]).unwrap().to_string();
            let units_sold: u32 = units_sold_string.parse::<u32>().unwrap_or_else(|_| panic!("Failed to convert string {} to number", units_sold_string));
            *sumarrized_data.entry(std::str::from_utf8(&raw_record[1]).unwrap().to_string()).or_insert(0) += units_sold;
        }
    }

    let mut sorted_values = Vec::from_iter(sumarrized_data);
    sorted_values.sort_by(|&(_, a), &(_, b)| b.cmp(&a));

    JsValue::from_serde(&sorted_values[0..5]).unwrap()
}

#[wasm_bindgen]
pub fn compress(file: &[u8]) -> Vec<u8> {
    let mut encoder = DeflateEncoder::new(Vec::new(), Compression::default());
    encoder.write_all(file).expect("Unable to compress file");
    return encoder.finish().unwrap();
}
