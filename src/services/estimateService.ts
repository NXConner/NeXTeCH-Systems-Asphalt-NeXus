import { apiService } from './apiService';

export async function fetchEstimateActions() {
  return await apiService.getEstimateActions();
}

export async function fetchEstimateFollowUps() {
  return await apiService.getEstimateFollowUps();
}

export async function uploadPhoto(file) {
  // Implement real upload logic
  return await apiService.uploadPhoto(file);
}

export async function getCurrentLocation() {
  // Use browser geolocation or device API
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => resolve(`${pos.coords.latitude}, ${pos.coords.longitude}`),
        err => reject(err)
      );
    } else {
      reject('Geolocation not supported');
    }
  });
} 