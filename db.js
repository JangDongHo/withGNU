const dfd = require("danfojs-node");

dfd
  .readCSV("./db.csv")
  .then((df) => {
    let sub_df = df.loc({
      columns: [
        "상권업종대분류명",
        "상호명",
        "상권업종중분류명",
        "상권업종소분류명",
        "표준산업분류명",
        "행정동명",
        "위도",
        "경도",
      ],
    });
    sub_df.head().print();
  })
  .catch((err) => {
    console.log(err);
  });
