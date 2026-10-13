const API_URL = (import.meta.env.VITE_API_URL || 'https://lucky-business.onrender.com/api').replace(/\/+$/, '');
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');
export async function fetchLivestock(params = {}) { const query = new URLSearchParams(); Object.entries(params).forEach(([key, value]) => { if (value !== '' && value !== undefined && value !== null) query.set(key, value); }); const response = await fetch(`${API_URL}/livestock${query.toString() ? `?${query}` : ''}`); if (!response.ok) throw new Error('Unable to load livestock'); return response.json(); }
export function uploadLivestock(formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/livestock/upload`);
    if (xhr.upload && typeof onProgress === 'function') {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
          onProgress(percent);
        }
      };
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          if (typeof onProgress === 'function') onProgress(100);
          resolve(JSON.parse(xhr.responseText));
        } catch {
          resolve({});
        }
      } else {
        reject(new Error('Unable to upload listing'));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}
export async function deleteLivestock(id, adminKey) { const response = await fetch(`${API_URL}/livestock/${id}`, { method: 'DELETE', headers: { 'X-Admin-Key': adminKey } }); if (!response.ok) throw new Error('Unable to remove listing'); }
export async function checkAdmin(adminKey) { const response = await fetch(`${API_URL}/livestock/admin-check`, { headers: { 'X-Admin-Key': adminKey } }); if (!response.ok) throw new Error('Invalid admin key'); }
export async function loginAdmin(phone, password) { const response = await fetch(`${API_URL}/livestock/admin-login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, password }) }); if (!response.ok) throw new Error('Invalid admin credentials'); return response.json(); }
export async function updateLivestock(id, data, adminKey) { const response = await fetch(`${API_URL}/livestock/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey }, body: JSON.stringify(data) }); if (!response.ok) throw new Error('Unable to update listing'); return response.json(); }
