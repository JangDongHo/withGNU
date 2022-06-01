import Restaurant from "../models/Restaurant";

export const home = async (req, res) => {
  const restaurants = await Restaurant.find({});
  return res.render("home", { pageTitle: "Home", restaurants });
};

export const search = async (req, res) => {
  const { campus, type } = req.query;
  let filter = {};
  if (campus) {
    filter["category.dong"] = campus;
  }
  if (type === "dessert") {
    filter["category.cate_1"] = "커피점/카페";
  }
  console.log(filter);
  const restaurants = await Restaurant.find(filter);
  return res.render("restaurants/search", {
    pageTitle: "검색",
    restaurants,
  });
};

export const info = async (req, res) => {
  const restaurant = await Restaurant.findById(id);
  return res.render("restaurants/info", {
    pageTitle: restaurant.name,
    restaurant,
  });
};
