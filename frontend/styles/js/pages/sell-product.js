// Sell Product Page Module

async function renderSellProductContent(params) {

const editId = new URLSearchParams(window.location.hash.split("?")[1]).get("id");
const app = document.getElementById("app");
const user = Auth.getCurrentUser();

if (!user) {
app.innerHTML = `
<div class="container">
<div class="empty-state" style="min-height:400px;">
<div class="empty-state-title">Please sign in</div>
<p class="empty-state-message">Sign in to list your products</p>
</div>
</div>
`;
return;
}

/* ===============================
UI
=============================== */

app.innerHTML = `

<div class="container" style="
padding-top:2rem;
padding-bottom:2rem;
display:flex;
justify-content:center;
align-items:center;
min-height:80vh;
flex-direction:column;
">

<h1 id="formTitle" style="
font-size:2rem;
font-weight:700;
color:var(--color-forest);
margin-bottom:2rem;
">
List a New Product
</h1>

<div style="
max-width:800px;
width:100%;
background:white;
border:1px solid #E5E7EB;
border-radius:1rem;
padding:2rem;
box-shadow:0 10px 25px rgba(0,0,0,0.08);
">

<form id="listingForm">

<div class="form-group">
<label>Product Title*</label>
<input type="text" id="productTitle" required>
</div>

<div class="form-group">
<label>Description</label>
<textarea id="productDesc"></textarea>
</div>

<div class="form-group">
<label>Category*</label>
<select id="productCategory">
<option value="Seeds">Seeds</option>
<option value="Livestock">Livestock</option>
<option value="Fresh Produce">Fresh Produce</option>
</select>
</div>

<div class="form-group">
<label>Price*</label>
<input type="number" id="productPrice" required>
</div>

<div class="form-group">
<label>Units*</label>
<select id="productUnit">
<option value="kg">kg</option>
<option value="piece">piece</option>
<option value="bundle">bundle</option>
</select>
</div>

<div class="form-group">
<label>Stock*</label>
<input type="number" id="productStock">
</div>

<div class="form-group">
<label>Image URL</label>
<input type="text" id="imageUrl" placeholder="Paste image link">

<label style="margin-top:10px;">Upload Image*</label>
<input type="file" id="imageFile" accept="image/*">

<img id="previewImg" style="margin-top:10px;max-width:150px;display:none;border-radius:8px;" />

</div>

<div class="form-group">
<label>Location*</label>
<input type="text" id="productLocation">
</div>

<div class="organic-toggle">
<label class="switch">
<input type="checkbox" id="isOrganic">
<span class="slider"></span>
</label>
<span class="organic-label">🍃 Certified Organic Product</span>
</div>

<button type="submit" class="btn btn-primary">
Save Product
</button>

</form>

</div>
</div>
`;

/* ===============================
UPLOAD FUNCTION
=============================== */

async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("http://localhost:4000/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  return data.image_url;
}

/* ===============================
EDIT MODE
=============================== */

if (editId) {
  try {
    const product = await API.getProduct(editId);

    document.getElementById("formTitle").textContent = "Edit Product";

    document.getElementById("productTitle").value = product.title;
    document.getElementById("productDesc").value = product.description;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productUnit").value = product.unit;
    document.getElementById("productStock").value = product.stock_quantity;
    document.getElementById("imageUrl").value = product.image_url;
    document.getElementById("productLocation").value = product.location;
    document.getElementById("isOrganic").checked = product.is_organic;

    if (product.image_url) {
      const preview = document.getElementById("previewImg");
      preview.src = product.image_url;
      preview.style.display = "block";
    }

  } catch (err) {
    console.error("Failed to load product", err);
  }
}

/* ===============================
IMAGE PREVIEW
=============================== */

document.getElementById("imageFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const preview = document.getElementById("previewImg");
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  }
});

/* ===============================
FORM SUBMIT
=============================== */

document.getElementById("listingForm").addEventListener("submit", async (e)=>{

e.preventDefault();

const imageUrlInput = document.getElementById("imageUrl");
const imageFileInput = document.getElementById("imageFile");

let finalImage = imageUrlInput.value.trim();

const file = imageFileInput.files[0];

/* ✅ FILE UPLOAD */
if (file) {
  try {
    finalImage = await uploadImage(file);
  } catch (err) {
    console.error(err);
    showToast("Image upload failed", "error");
    return;
  }
}

/* VALIDATION */
if (!finalImage) {
  showToast("Please provide image URL or upload image","error");
  return;
}

/* DATA */

const listingData = {

title: document.getElementById("productTitle").value,
description: document.getElementById("productDesc").value,
category: document.getElementById("productCategory").value,
price: parseFloat(document.getElementById("productPrice").value),
unit: document.getElementById("productUnit").value,
stock_quantity: parseInt(document.getElementById("productStock").value) || 0,
image_url: finalImage,
location: document.getElementById("productLocation").value,
is_organic: document.getElementById("isOrganic").checked,

seller_name: user.full_name,
seller_email: user.email,

status: "active"

};

try {

if(editId){
await API.updateListing(editId, listingData);
showToast("Product updated successfully","success");
}else{
await API.createListing(user.id, listingData);
showToast("Product listed successfully","success");
}

setTimeout(()=>{
Router.navigate("my-listings");
},1500);

}catch(error){
console.error(error);
showToast(error.message,"error");
}

});

}