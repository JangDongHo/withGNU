import Restaurant from "../models/Restaurant";

export const home = async (req, res) => {
  const restaurants = await Restaurant.find({});
  return res.render("home", { pageTitle: "Home", restaurants });
};

export const list = async (req, res) => {
  const restaurants = await Restaurant.find({ "category.cate_1": "한식" });
  return res.render("restaurants/list", {
    pageTitle: "맛집 베스트",
    restaurants,
  });
};

export const info = async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  return res.render("restaurants/info", { pageTitle: "식당", restaurant });
};
