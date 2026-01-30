const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let filter = {};
  if (req.query.category) {
  filter.category = req.query.category;
}
if (req.query.country) {
  filter.country = req.query.country;
}

  const allListing = await Listing.find(filter);
  res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
   let coordinates = await geocodingClient.forwardGeocode({
  query: req.body.listings.location,
  limit: 1
})
  .send();
  
  let url = req.file.path;
  let filename = req.file.filename;
  
  let newlisting = new Listing(req.body.listings);
  newlisting.owner = req.user._id;
  newlisting.image = {url,filename};
  newlisting.geometry = coordinates.body.features[0].geometry;
  let savedListiting = await newlisting.save();
  console.log(savedListiting);
  req.flash("success", "new listing created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalUrlImage = listing.image.url;
  originalUrlImage = originalUrlImage.replace("/upload","/upload/w_250")
  res.render("listings/edit.ejs", { listing,originalUrlImage });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listings },
    { runValidators: true }
  );
  if(typeof req.file!="undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
   listing.image = {url,filename};
  await listing.save();
}
 
  req.flash("success", "listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListings = await Listing.findByIdAndDelete(id);
  console.log(deletedListings);
  req.flash("success", "listing deleted!");
  res.redirect("/listings");
};
