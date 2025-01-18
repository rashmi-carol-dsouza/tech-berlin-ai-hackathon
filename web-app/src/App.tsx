import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Base/Layout/Layout";
import HereAndNow from "./pages/HereAndNow/HereAndNow";
import { LocationProvider } from "./context/Location";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
      <Layout>
        <HereAndNow />
      </Layout>
      </LocationProvider>
    </QueryClientProvider>
  );
}

export default App
