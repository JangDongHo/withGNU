import Restaurant from "../models/Restaurant";

export const home = async (req, res) => {
  const restaurants = await Restaurant.find({});
  return res.render("home", { pageTitle: "Home", restaurants });
};

export const info = async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  return res.render("restaurants/info", { pageTitle: "식당", restaurant });
};
