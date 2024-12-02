async function main() {
    const allProds = document.querySelector(".product-c");
    const res = await fetch("http://localhost:3000/api/products");
    const products = await res.json();
    products.forEach(function (product) {
        const container = document.createElement("div");
        container.classList.add("indiv-prod");

        const title = document.createElement("h4");
        title.textContent = product.name;

        const descr = document.createElement("p");
        descr.textContent = product.description;

        const price = document.createElement("p");
        price.textContent = "$" + product.price;

        const quantity = document.createElement("p");
        quantity.textContent = "Quantity: " + product.quantity;

        const category = document.createElement("p");
        category.textContent = "Category: " + product.category;

        container.appendChild(title);
        container.appendChild(descr);
        container.appendChild(price);
        container.appendChild(quantity);
        container.appendChild(category);
        allProds.appendChild(container);
    })

}
main();