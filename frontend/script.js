document.getElementById("loginBtn").addEventListener("click", loginUser);
document.getElementById("uploadBtn").addEventListener("click", (event) => { event.preventDefault();
  uploadProduct();
});

// At the top of script.js, check token on page load
window.addEventListener("load", () => {
  const token = localStorage.getItem("token");
  if (token) {
    document.getElementById("product-section").style.display = "block";
    document.getElementById("login-section").style.display = "none"; // Optional: hide login
  }
});

async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter both username and password.");
    return;
  }
  try {
    const response = await axios.post("http://localhost:5100/api/auth/login", {
      email,
      password,
    });

    if (response.status === 200) {
      const token = response.data.token;
      localStorage.setItem("token", token);
      // alert("Login successful!");
      document.getElementById("product-section").style.display = "block";
    } else {
      alert("Login failed. Please check your credentials.");
    }
  } catch (error) {
    console.log("Error during login:", error);
  }
}

async function uploadProduct() {
  const title = document.getElementById("productTitle").value.trim();
  const imageFile = document.getElementById("productImage").files[0];

  if (!title || !imageFile) {
    alert("Please enter a product title and select an image.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to upload a product.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("image", imageFile);

  try {
    const response = await axios.post(
      "http://localhost:5100/api/products",
      formData,
      {
        headers: {
          // "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}` // Uncomment if you want to send the token
        },
      }
    );

    if (response.status === 200) {
      // alert("Product uploaded successfully!");
      showPreview(title, response.data.product.imageUrl);
    }
  } catch (error) {
    console.error("Error uploading product:", error);
    alert("Failed to upload product. Please try again.");
  }
}



function showPreview(title, imageUrl) {
  const previewDiv = document.getElementById("preview");
  previewDiv.innerHTML = ""; // Clear previous previews
  let card = document.createElement("div");
  card.innerHTML = `<h4>${title}</h4>
    <img src="${imageUrl}" alt="${title}" style="max-width: 200px; display:block; margin-top:5px;">`;
  previewDiv.appendChild(card);
  previewDiv.style.display = "block";
  document.getElementById("productTitle").value = ""; // Clear input field
  document.getElementById("productImage").value = "";
  
}