import comicsApi from "comicbooks-api";

try {
  const getApi = async () => {
    const comics = await comicsApi.getComicsThroughSearch("batman", 1);
    console.log(comics);
  };
  getApi();
} catch (err) {
  console.log(err);
}
