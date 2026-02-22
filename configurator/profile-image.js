/**
 * Profile image picker: default, local upload, or URL.
 * Local files are included in the zip as avatar.jpg.
 */

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
    let src = null;
    if (mode === "upload" && profileImageFile) {
      src = URL.createObjectURL(profileImageFile);
    } else if (mode === "url" && urlInput.value.trim()) {
      src = urlInput.value.trim();
    }
    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Profile preview";
      preview.appendChild(img);
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
 * Restore profile image from saved state (URL only; local file can't be persisted).
 */
export function setProfileImageFromState(state) {
  const img = state?.profile?.image;
  if (!img) return;
  if (img.startsWith("http://") || img.startsWith("https://")) {
    const urlRadio = document.querySelector('input[name="profileImageMode"][value="url"]');
    if (urlRadio) {
      urlRadio.checked = true;
      document.getElementById("profileImageUrlInput").value = img;
      urlRadio.dispatchEvent(new Event("change"));
    }
  }
}

export { PROFILE_IMAGE_FILENAME };
