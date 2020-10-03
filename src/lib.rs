extern crate serde_derive;
extern crate web_sys;

use std::iter::FromIterator;
use std::str;

use wasm_bindgen::__rt::std::collections::{HashMap};
use wasm_bindgen::prelude::*;
use flate2::write::{DeflateEncoder};
use std::io::prelude::*;
use flate2::Compression;
use serde::{Serialize, Deserialize};

mod utils;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;


#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
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

    pub fn process_records_as_js_objects(&mut self, parsed_sales_records: &JsValue) {
        let sales_records: Vec<SalesRecord> = parsed_sales_records.into_serde().unwrap();
        self.sales_records = sales_records
    }

    pub fn process_records_from_csv_text_as_string(&mut self, csv_text: &str) {
        let mut rdr = csv::Reader::from_reader(csv_text.as_bytes());
        for result in rdr.deserialize() {
            let sales_record: SalesRecord = result.unwrap();
            self.sales_records.push(sales_record)
        }
    }

    pub fn process_records_from_csv_text_as_bytes(&mut self, csv_text: &[u8]) {
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
        let mut summarized_data: HashMap<String, u32> = HashMap::new();

        for sales_record in self.sales_records.iter() {
            if sales_record.item_type.eq(item_type) {
                *summarized_data.entry(sales_record.country.to_string()).or_insert(0) += sales_record.units_sold;
            }
        }
        let mut sorted_values = Vec::from_iter(summarized_data);
        sorted_values.sort_by(|&(_, a), &(_, b)| b.cmp(&a));

        JsValue::from_serde(&sorted_values[0..10]).unwrap()
    }
}

#[wasm_bindgen]
pub struct FileCompressor {}

#[wasm_bindgen]
impl FileCompressor {
    pub fn new() -> FileCompressor {
        utils::set_panic_hook();
        FileCompressor {}
    }

    pub fn compress(file: &[u8]) -> Vec<u8> {
        let mut encoder = DeflateEncoder::new(Vec::new(), Compression::default());
        encoder.write_all(file).expect("Unable to compress file");
        return encoder.finish().unwrap();
    }
}
