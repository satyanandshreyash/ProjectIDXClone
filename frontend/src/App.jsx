import "./App.css";
import usePing from "./hooks/apis/queries/usePing";

function App() {
  const { isLoading, data } = usePing();
  // useEffect(() => {
  //   pingAPI();
  // }, []);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <>Hello {data.message}!</>;
}

export default App;
