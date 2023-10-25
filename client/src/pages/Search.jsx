import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);

  console.log(listing);

  const navigate = useNavigate();

  const [sideBardata, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlparams.get("searchTerm");
    const typeFromUrl = urlparams.get("type");
    const parkingFromUrl = urlparams.get("parking");
    const furnishedFromUrl = urlparams.get("furnished");
    const offerFromUrl = urlparams.get("offer");
    const sortFromUrl = urlparams.get("sort");
    const orderFromUrl = urlparams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      const searchQuery = urlparams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListing(data);
      setLoading(false);
    };

    fetchListing();
  }, [location.search]);

  console.log(sideBardata);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "sale" ||
      e.target.id === "rent"
    ) {
      setSideBarData({ ...sideBardata, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSideBarData({ ...sideBardata, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sideBardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";

      setSideBarData({ ...sideBardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlparams = new URLSearchParams();
    urlparams.set("searchTerm", sideBardata.searchTerm);
    urlparams.set("type", sideBardata.type);
    urlparams.set("parking", sideBardata.parking);
    urlparams.set("furnihed", sideBardata.furnished);
    urlparams.set("offer", sideBardata.offer);
    urlparams.set("sort", sideBardata.sort);
    urlparams.set("order", sideBardata.order);
    const searchQuery = urlparams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfListings = listing.length;
    const startIndex = numberOfListings;
    const urlparams = new URLSearchParams(location.search);
    urlparams.set("startIndex", startIndex);
    const searchQuery = urlparams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListing([...listing, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap">Search Term:</label>
            <input
              type="text"
              placeholder="search..."
              value={sideBardata.searchTerm}
              id="searchTerm"
              className="border rounded-lg p-2 w-full"
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label>Type :</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={sideBardata.type === "all"}
                onChange={handleChange}
                id="rent&sale"
                className="w-5"
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={sideBardata.type === "rent"}
                onChange={handleChange}
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={sideBardata.type === "sale"}
                onChange={handleChange}
                id="sale"
                className="w-5"
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                checked={sideBardata.offer}
                onChange={handleChange}
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label>Aminities :</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                checked={sideBardata.parking}
                onChange={handleChange}
                className="w-5"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                checked={sideBardata.furnished}
                onChange={handleChange}
                className="w-5"
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label>Sort</label>
            <select
              id="sort_order"
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              className="border rounded-lg p-2"
            >
              <option value={"regular_price_desc"}>Price high to low</option>
              <option value={"regular_price_asc"}>Price low to high</option>
              <option value={"createdAt_desc"}>Latest</option>
              <option value={"createdAt_asc"}>Oldest</option>
            </select>
          </div>
          <div>
            <button className="uppercase p-2 text-white rounded-lg bg-slate-700 min-w-full hover:opacity-75">
              search
            </button>
          </div>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-2xl p-3 border-b-2 text-slate-700 font-semibold min-w-full ">
          Listing search results
        </h1>
        <div className="flex flex-row p-5 items-center gap-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-3  gap-8 p-3 m-3">
            {!loading && listing.length === 0 && (
              <p className="font-medium text-lg text-red">No listing found</p>
            )}
            {loading && (
              <p className="uppercase text-slate-700 text-lg text-center font-semibold">
                Loading...
              </p>
            )}
            {!loading &&
              listing &&
              listing.map((item) => <ListingItem key={item._id} item={item} />)}
          </div>
        </div>
        {showMore && (
          <button
            onClick={handleShowMore}
            className="uppercase w-full text-center py-3 font-bold text-green-700 mb-5"
          >
            show more
          </button>
        )}
      </div>
    </div>
  );
}
