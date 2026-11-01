import {
  useState,
  useCallback,
  useMemo,
  useReducer,
  useEffect,
} from "react";

import useFetchPhotos from "./hooks/useFetchPhotos";
import favoriteReducer, {
  initialFavorites,
} from "./favoriteReducer";

function App() {
  const { photos, loading, error } = useFetchPhotos();

  // Favourite state
  const [favorites, dispatch] = useReducer(
    favoriteReducer,
    initialFavorites
  );

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Save favourites in localStorage
  useEffect(() => {
    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // Search handler
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  // Filter photos by author name
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [photos, searchTerm]);

  // Toggle favourite
  const handleFavorite = (photo) => {
    dispatch({
      type: "TOGGLE_FAVORITE",
      payload: photo,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="flex flex-wrap items-center justify-between gap-4 px-6 md:px-10 py-5 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-purple-700">
          celebrare
        </h1>

        <div className="flex flex-wrap gap-4 md:gap-8 text-gray-700 font-medium">
          <a href="#" className="hover:text-purple-600">
            Home
          </a>

          <a href="#gallery" className="hover:text-purple-600">
            Gallery
          </a>

          <a href="#favorites" className="hover:text-purple-600">
            Favorites
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative min-h-[450px] px-6 py-20 text-center bg-cover bg-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: "url('/images/hero.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Celebrate Your Special Moments
          </h2>

          <p className="text-lg text-white">
            Discover beautiful memories with Celebrare Gallery.
          </p>
        </div>
      </section>

      {/* Photo Gallery */}
      <section
        id="gallery"
        className="px-6 py-12 md:px-10"
      >
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">
          Our Photo Gallery
        </h2>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search by author name..."
            value={searchTerm}
            onChange={(e) =>
              handleSearch(e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-600">
            Loading photos...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500">
            {error}
          </p>
        )}

        {/* Photos */}
        {!loading && !error && (
          <>
            {filteredPhotos.length === 0 ? (
              <p className="text-center text-gray-500">
                No photos found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {filteredPhotos.map((photo) => {
                  const isFavorite = favorites.some(
                    (item) => item.id === photo.id
                  );

                  return (
                    <div
                      key={photo.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                      <img
                        src={photo.download_url}
                        alt={`Photo by ${photo.author}`}
                        className="w-full h-56 object-cover"
                      />

                      <div className="p-3 flex items-center justify-between gap-2">
                        <p className="font-medium text-gray-700 text-sm">
                          Photo by {photo.author}
                        </p>

                        <button
                          onClick={() =>
                            handleFavorite(photo)
                          }
                          className="text-2xl hover:scale-110 transition"
                          aria-label={
                            isFavorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          {isFavorite ? "❤️" : "🤍"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* Favourite Photos */}
      <section
        id="favorites"
        className="px-6 py-12 md:px-10 bg-purple-50"
      >
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">
          My Favorite Photos ❤️
        </h2>

        {favorites.length === 0 ? (
          <p className="text-center text-gray-500">
            No favorite photos yet. Click the heart icon
            to add photos.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {favorites.map((photo) => (
              <div
                key={photo.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={photo.download_url}
                  alt={`Photo by ${photo.author}`}
                  className="w-full h-56 object-cover"
                />

                <div className="p-3 flex items-center justify-between gap-2">
                  <p className="font-medium text-gray-700 text-sm">
                    Photo by {photo.author}
                  </p>

                  <button
                    onClick={() => handleFavorite(photo)}
                    className="text-2xl"
                    aria-label="Remove from favorites"
                  >
                    ❤️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white text-center py-6 text-gray-600">
        © 2026 Celebrare Gallery. All rights reserved.
      </footer>

    </div>
  );
}

export default App;