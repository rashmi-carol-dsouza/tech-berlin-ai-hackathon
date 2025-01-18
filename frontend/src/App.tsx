import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Base/Layout/Layout";
import HereAndNow from "./pages/HereAndNow/HereAndNow";

const queryClient = new QueryClient()

function App() {
  const lat = 52.52; // Example latitude for Berlin
  const long = 13.405; // Example longitude for Berlin

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <HereAndNow lat={lat} long={long} />
      </Layout>
    </QueryClientProvider>
  );
}

export default App
