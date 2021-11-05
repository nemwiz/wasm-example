use std::collections::HashMap;
use std::iter::FromIterator;
use std::str;

use csv::ByteRecord;
#[cfg(feature = "parallel")]
use rayon::prelude::*;
/**
 * Copyright 2021 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
use wasm_bindgen::{prelude::*};
#[cfg(feature = "parallel")]
pub use wasm_bindgen_rayon::init_thread_pool;
use web_sys::console;

use crate::{SalesRecord, utils};

#[wasm_bindgen]
pub struct MultiThreadedSalesRecordStore {
    sales_records: Vec<SalesRecord>,
}

#[wasm_bindgen]
impl MultiThreadedSalesRecordStore {
    pub fn new() -> MultiThreadedSalesRecordStore {
        utils::set_panic_hook();
        MultiThreadedSalesRecordStore {
            sales_records: vec![]
        }
    }

    pub fn process_records_from_csv_text_as_string(&mut self, csv_text: &str) {
        let mut rdr = csv::Reader::from_reader(csv_text.as_bytes());
        for result in rdr.deserialize() {
            let sales_record: SalesRecord = result.unwrap();
            self.sales_records.push(sales_record)
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
pub fn summarize(numbers: &[u8]) -> i32 {
    let some_numbers_list: Vec<i32> = vec![89, 1923, 9312, 4812, 9123, 31];

    let dim_sum: i32 = some_numbers_list
        .par_iter()
        .sum();

    return dim_sum;
}

#[wasm_bindgen]
pub fn process_records_from_csv_text_as_bytes(csv_text: &[u8], item_type: &str) -> u32 {
    utils::set_panic_hook();

    let mut csv_reader = csv::Reader::from_reader(csv_text);

    let mut raw_records: Vec<SalesRecord> = csv_reader.into_byte_records()
        .into_iter()
        .par_bridge()
        .map(|r| {
            let record = r.unwrap();

            let country = str::from_utf8(record.get(1).unwrap()).unwrap().to_string();
            let item_type = str::from_utf8(record.get(2).unwrap()).unwrap().to_string();
            let sales_channel = str::from_utf8(record.get(3).unwrap()).unwrap().to_string();

            let order_id_string = str::from_utf8(record.get(6).unwrap()).unwrap().to_string();
            let order_id: u64 = order_id_string.parse::<u64>().unwrap_or_else(|_| panic!("Failed to convert string {} to number", order_id_string));

            let units_sold_string = str::from_utf8(record.get(8).unwrap()).unwrap().to_string();
            let units_sold: u32 = units_sold_string.parse::<u32>().unwrap_or_else(|_| panic!("Failed to convert string {} to number", units_sold_string));

            SalesRecord { country, item_type, sales_channel, order_id, units_sold }
        })
        .filter(|r| r.item_type.eq(item_type))
        .collect();

    let mut sales_records: Vec<SalesRecord> = vec![];

    // let sales_records: Vec<SalesRecord> = csv_reader.into_byte_records().par_iter()
    //     .map(|r| {
    //         let country = str::from_utf8(&raw_record[1]).unwrap().to_string();
    //         let item_type = str::from_utf8(&raw_record[2]).unwrap().to_string();
    //         let sales_channel = str::from_utf8(&raw_record[3]).unwrap().to_string();
    //
    //         let order_id_string = str::from_utf8(&raw_record[6]).unwrap().to_string();
    //         let order_id: u64 = order_id_string.parse::<u64>().unwrap_or_else(|_| panic!("Failed to convert string {} to number", order_id_string));
    //
    //         let units_sold_string = str::from_utf8(&raw_record[8]).unwrap().to_string();
    //         let units_sold: u32 = units_sold_string.parse::<u32>().unwrap_or_else(|_| panic!("Failed to convert string {} to number", units_sold_string));
    //
    //         SalesRecord { country, item_type, sales_channel, order_id, units_sold }
    //     })
    //     // .filter(|r| r.item_type.eq(item_type))
    //     .collect();

    console::log_1(&sales_records.len().into());
    console::log_1(&raw_records.len().into());

    let mut summarized_data: HashMap<String, u32> = HashMap::new();

    let dim_sum: u32 = sales_records
        .par_iter()
        .map(|r| r.units_sold)
        .sum();

    // for sales_record in sales_records.into_iter().par_iter() {
    //     if sales_record.item_type.eq(item_type) {
    //         *summarized_data.entry(sales_record.country.to_string()).or_insert(0) += sales_record.units_sold;
    //     }
    // }
    let mut sorted_values = Vec::from_iter(summarized_data);
    sorted_values.sort_by(|&(_, a), &(_, b)| b.cmp(&a));

    // JsValue::from_serde(&sorted_values[0..10]).unwrap()
    return dim_sum;
}