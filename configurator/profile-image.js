/**
 * Profile image picker: default, local upload, or URL.
 * Local files are included in the zip as avatar.jpg.
 */

import { getInitials } from "../site/limn-engine.js";

const PROFILE_IMAGE_FILENAME = "avatar.jpg";

let profileImageFile = null;

export function initProfileImagePicker() {
  const modeRadios = document.querySelectorAll('input[name="profileImageMode"]');
  const uploadWrap = document.getElementById("profileImageUpload");
  const urlWrap = document.getElementById("profileImageUrl");
  const fileInput = document.getElementById("profileImageFile");
  const fileBtn = document.getElementById("profileImageFileBtn");
  const filenameSpan = document.getElementById("profileImageFilename");
  const urlInput = document.getElementById("profileImageUrlInput");
  const preview = document.getElementById("profileImagePreview");

  function showHide() {
    const mode = document.querySelector('input[name="profileImageMode"]:checked')?.value || "default";
    uploadWrap.hidden = mode !== "upload";
    urlWrap.hidden = mode !== "url";
    updatePreview();
  }

  function updatePreview() {
    preview.innerHTML = "";
    const mode = document.querySelector('input[name="profileImageMode"]:checked')?.value || "default";
    if (mode === "default") {
      const nameInput = document.getElementById("name");
      const initials = getInitials(nameInput?.value ?? "");
      const div = document.createElement("div");
      div.className = "profile-image-preview-initials";
      div.setAttribute("aria-hidden", "true");
      div.textContent = initials;
      preview.appendChild(div);
    } else if (mode === "upload" && profileImageFile) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(profileImageFile);
      img.alt = "Profile preview";
      preview.appendChild(img);
    } else if (mode === "url") {
      const val = urlInput.value.trim();
      if (val.startsWith("http://") || val.startsWith("https://")) {
        const img = document.createElement("img");
        img.src = val;
        img.alt = "Profile preview";
        preview.appendChild(img);
      }
    }
  }

  modeRadios.forEach(function(radio) {
    radio.addEventListener("change", showHide);
  });

  fileBtn.addEventListener("click", function() {
    fileInput.click();
  });

  fileInput.addEventListener("change", function() {
    const file = fileInput.files?.[0];
    if (file && file.type.startsWith("image/")) {
      profileImageFile = file;
      filenameSpan.textContent = file.name;
    } else {
      profileImageFile = null;
      filenameSpan.textContent = "";
    }
    updatePreview();
  });

  urlInput.addEventListener("input", function() {
    updatePreview();
  });

  const nameInput = document.getElementById("name");
  if (nameInput) {
    nameInput.addEventListener("input", function() {
      const mode = document.querySelector('input[name="profileImageMode"]:checked')?.value || "default";
      if (mode === "default") updatePreview();
    });
  }

  showHide();
}

/**
 * Returns { image: string, mode: "default"|"upload"|"url", file?: File }
 * - default: image = "avatar.jpg", use bundled avatar
 * - upload: image = "avatar.jpg", file = user's File (include in zip)
 * - url: image = the URL string (no file in zip)
 */
export function getProfileImageConfig() {
  const mode = document.querySelector('input[name="profileImageMode"]:checked')?.value || "default";
  if (mode === "upload" && profileImageFile) {
    return { image: PROFILE_IMAGE_FILENAME, mode: "upload", file: profileImageFile };
  }
  if (mode === "url") {
    const url = document.getElementById("profileImageUrlInput").value.trim();
    if (url) return { image: url, mode: "url" };
  }
  return { image: PROFILE_IMAGE_FILENAME, mode: "default" };
}

/**
 * Restore profile image from saved state. Shows the config value in the URL field
 * so the user can see and edit it (works for avatar.jpg, URLs, or any path).
 */
export function setProfileImageFromState(state) {
  const img = state?.profile?.image;
  const urlInput = document.getElementById("profileImageUrlInput");
  const urlRadio = document.querySelector('input[name="profileImageMode"][value="url"]');

  if (img && urlRadio && urlInput) {
    urlRadio.checked = true;
    urlInput.value = img;
    urlRadio.dispatchEvent(new Event("change"));
  } else {
    const defaultRadio = document.querySelector('input[name="profileImageMode"][value="default"]');
    if (defaultRadio) {
      defaultRadio.checked = true;
      defaultRadio.dispatchEvent(new Event("change"));
    }
    if (urlInput) urlInput.value = "";
    profileImageFile = null;
    const filenameSpan = document.getElementById("profileImageFilename");
    if (filenameSpan) filenameSpan.textContent = "";
  }
}

export { PROFILE_IMAGE_FILENAME };
