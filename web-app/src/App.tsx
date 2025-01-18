import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Base/Layout/Layout";
import HereAndNow from "./pages/HereAndNow/HereAndNow";
import { LocationProvider } from "./context/Location";
import { RefProvider } from "./context/Ref";
import { ViewProvider } from "./context/View";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <RefProvider>
        <ViewProvider>
          <Layout>
            <HereAndNow />
          </Layout>
          </ViewProvider>
        </RefProvider>
      </LocationProvider>
    </QueryClientProvider>
  );
}

export default App
