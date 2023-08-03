import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndPoint = apiUrl + "/userLikedMovies";

function likedMoviesUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export function getAllLikedMovies() {
  return http.get(apiEndPoint);
}

export function getLikedMovies(userId) {
  return http.get(likedMoviesUrl(userId));
}

export function saveLikedMovies(userLikedMoviesObj) {
  if (userLikedMoviesObj._id) {
    //when updating a movie
    const body = { ...userLikedMoviesObj };
    delete body._id; //it doesn't want id inside the body of object, id in url is ok to identify it, using req.params._id
    return http.put(likedMoviesUrl(userLikedMoviesObj._id), body);
  }
  //when creating a movie
  return http.post(apiEndPoint, userLikedMoviesObj);
}

export function deleteLikedMovies(userLikedMoviesId) {
  return http.delete(likedMoviesUrl(userLikedMoviesId));
}
