import { useEffect, useState } from "react";

function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://picsum.photos/v2/list?page=1&limit=30",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch photos");
        }

        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPhotos();

    return () => controller.abort();
  }, []);

  return { photos, loading, error };
}

export default useFetchPhotos;