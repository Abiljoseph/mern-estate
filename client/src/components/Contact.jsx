import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLanload] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLanload(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLandLord();
  }, [listing.userRef]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-3">
          <p>
            Contact <span>{landlord.username}</span> for{" "}
            <span className="font-semibold"> {listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows={2}
            value={message}
            onChange={onChange}
            placeholder="Enter your message here...."
            className="w-full border p-3 rounded-lg"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=regarding${listing.name}&body=${message}`}
            className="bg-slate-600 p-3 rounded-lg hover:opacity-80 text-white uppercase text-center"
          >
            Send message
          </Link>
        </div>
      )}
    </>
  );
}
