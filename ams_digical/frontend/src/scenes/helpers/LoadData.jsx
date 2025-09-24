import useFetchData from "../../hooks/useFetchData";

// Function to load all data at once

const LoadData = () => {
  const {
    data: samples,
    loading: loadingSamples,
    error: errorSamples,
    refetch: refetchSamples,
  } = useFetchData("/batches/");
  const {
    data: sources,
    loading: loadingSources,
    error: errorSources,
    refetch: refetchSources,
  } = useFetchData("/machines/");
  const {
    data: maintenance,
    loading: loadingMaintenance,
    error: errorMaintenance,
    refetch: refetchMaintenance,
  } = useFetchData("/maintenance/");

  const {
    data: staff,
    loading: loadingStaff,
    error: errorStaff,
    refetch: refetchStaff,
  } = useFetchData("/staff/");

  const {
    data: upcomingEvents,
    loading: loadingEvents,
    error: errorEvents,
    refetch: refetchEvents,
  } = useFetchData("/events/?upcoming=True");

  const refetchAll = () => {
    refetchSamples();
    refetchSources();
    refetchMaintenance();
    refetchStaff();
    refetchEvents();
  };

  return {
    data: { samples, maintenance, sources, staff, upcomingEvents },
    loading:
      loadingSamples ||
      loadingSources ||
      loadingMaintenance ||
      loadingStaff ||
      loadingEvents,
    error:
      errorSamples ||
      errorSources ||
      errorMaintenance ||
      errorStaff ||
      errorEvents,
    refetchAll: refetchAll,
  };
};

export default LoadData;
