const fs = require("fs");
const csv = require("csv-parser");
let results = [];

// DB csv -> json 변환
fs.createReadStream("db.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    results = results.filter(
      (value) =>
        value.상권업종대분류명 === "음식" && value.행정동명 === "가호동"
    );
  });
