import React from 'react';
import { useParams } from 'react-router-dom';
// Add to package.json: "react-router-dom": "^6.x.x"
// Run: npm install react-router-dom
import { useEffect, useState } from 'react';
// Add to package.json: "axios": "^1.x.x"
// Run: npm install axios @types/axios
  import API from '../services/api';

const ListingDetailsPage = () => {
  const { listingId } = useParams();
  const [listingData, setListingData] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [relatedListings, setRelatedListings] = useState<Array<any>>([]);
  // Map related listings in the related-listings section:
  const renderRelatedListings = () => {
    return relatedListings.map((listing, index) => (
      <div key={index} className="related-listing-item">
        {/* Add your related listing display logic here */}
      </div>
    ));
  };

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        const response = await API.get(`/api/listing/${listingId}`);
        setListingData(response.data);
      } catch (error) {
        console.error('Error fetching listing data:', error);
      }
    };

    const fetchSellerData = async () => {
      if (listingData) {
        try {
          const response = await API.get(`/api/user/${(listingData as { sellerId: string }).sellerId}`);
          setSellerData(response.data);
        } catch (error) {
          console.error('Error fetching seller data:', error);
        }
      }
    };

    const fetchRelatedListings = async () => {
      if (listingData) {
        try {
          const response = await API.get(`/api/listing/related?game=${(listingData as { game: string })?.game}`);
          setRelatedListings(response.data);
        } catch (error) {
          console.error('Error fetching related listings:', error);
        }
      }
    };

    fetchListingData();
    fetchSellerData();
    fetchRelatedListings();
  }, [listingId, listingData]);

  if (!listingData || !sellerData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="listing-details-page">
      <div className="media-info">
        {/* Media Carousel Component */}
      </div>
      <div className="purchase">
        {/* Purchase Section */}
      </div>
      <div className="account-info">
        {/* Account Summary Section */}
      </div>
      <div className="full-description">
        {/* Account Detail Description */}
      </div>
      <div className="related-listings">
        {/* Related Listings Section */}
      </div>
      <div className="report-listing">
        {/* Report Listing Section */}
      </div>
    </div>
  );
};

export default ListingDetailsPage;