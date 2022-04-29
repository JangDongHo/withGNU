import Restaurant from "../models/Restaurant";

export const home = async (req, res) => {
  const restaurants = await Restaurant.find({});
  return res.render("home", { pageTitle: "Home", restaurants });
};
