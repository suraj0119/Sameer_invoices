// Form Page Logic
if (document.getElementById("invoiceForm")) {
    const form = document.getElementById("invoiceForm");
    const itemsContainer = document.getElementById("itemsContainer");
    const addItemButton = document.getElementById("addItem");
    const grandTotalElement = document.getElementById("grandTotal");
  
    let grandTotal = 0;
  
    const calculateItemTotal = (itemRow) => {
      const quantity = +itemRow.querySelector(".quantity").value || 0;
      const rate = +itemRow.querySelector(".rate").value || 0;
      const total = quantity * rate;
      itemRow.querySelector(".total").textContent = total;
      return total;
    };
  
    const updateGrandTotal = () => {
      grandTotal = Array.from(itemsContainer.querySelectorAll(".item")).reduce(
        (sum, item) => sum + calculateItemTotal(item),
        0
      );
      grandTotalElement.textContent = grandTotal;
    };
  
    addItemButton.addEventListener("click", () => {
      const itemRow = document.createElement("div");
      itemRow.classList.add("item");
      itemRow.innerHTML = `
        <input type="text" placeholder="Item Name" class="itemName" required>
        <input type="number" placeholder="Quantity" class="quantity" required>
        <input type="number" placeholder="Rate" class="rate" required>
        <span class="total">0</span>
        <button type="button" class="removeItem">Remove</button>
      `;
      itemsContainer.appendChild(itemRow);
      itemRow.querySelector(".removeItem").addEventListener("click", () => {
        itemRow.remove();
        updateGrandTotal();
      });
      itemRow.querySelectorAll("input").forEach((input) =>
        input.addEventListener("input", updateGrandTotal)
      );
    });
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const companyName = document.getElementById("companyName").value;
      const invoiceNumber = document.getElementById("invoiceNumber").value;
      const date = document.getElementById("date").value;
      const items = Array.from(itemsContainer.querySelectorAll(".item")).map(
        (item) => ({
          name: item.querySelector(".itemName").value,
          quantity: item.querySelector(".quantity").value,
          rate: item.querySelector(".rate").value,
          total: item.querySelector(".total").textContent,
        })
      );
  
      const invoice = { companyName, invoiceNumber, date, items, grandTotal };
  
      const savedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
      savedInvoices.push(invoice);
      localStorage.setItem("invoices", JSON.stringify(savedInvoices));
  
      alert("Invoice saved!");
      form.reset();
      itemsContainer.innerHTML = ""; // Clear items
      updateGrandTotal();
    });
  }
  
  // Table Page Logic
// Table Page Logic
if (document.getElementById("invoiceTableBody")) {
    const invoiceTableBody = document.getElementById("invoiceTableBody");
    const savedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
  
    const renderTable = () => {
      invoiceTableBody.innerHTML = ""; // Clear existing table rows
      savedInvoices.forEach((invoice, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${invoice.companyName}</td>
          <td>${invoice.invoiceNumber}</td>
          <td>${invoice.date}</td>
          <td>${invoice.items.map((item) => `${item.name} (${item.quantity} x ${item.rate})`).join(", ")}</td>
          <td>${invoice.grandTotal}</td>
          <td>
            <button class="viewPrintButton" data-index="${index}">View/Print</button>
            <button class="deleteButton" data-index="${index}">Delete</button>
          </td>
        `;
        invoiceTableBody.appendChild(row);
      });
  
      // Add event listeners for View/Print buttons
      document.querySelectorAll(".viewPrintButton").forEach((button) => {
        button.addEventListener("click", (e) => {
          const index = e.target.getAttribute("data-index");
          const invoice = savedInvoices[index];
          printInvoice(invoice);
        });
      });
  
      // Add event listeners for Delete buttons
      document.querySelectorAll(".deleteButton").forEach((button) => {
        button.addEventListener("click", (e) => {
          const index = e.target.getAttribute("data-index");
          deleteInvoice(index);
        });
      });
    };
  
    const deleteInvoice = (index) => {
      if (confirm("Are you sure you want to delete this invoice?")) {
        savedInvoices.splice(index, 1); // Remove the invoice from the array
        localStorage.setItem("invoices", JSON.stringify(savedInvoices)); // Update local storage
        renderTable(); // Re-render the table
      }
    };
  
    // Function to print the invoice (unchanged)
    const printInvoice = (invoice) => {
      const totalRows = 30; // Total rows for items in the table
      const rowsNeeded = totalRows - invoice.items.length - 2; // Subtract 2 for the taxable value and bank details rows
      const emptyRows = Array(rowsNeeded)
        .fill()
        .map(
          () => `
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>`
        )
        .join("");
    
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                background: #fff;
                color: #000;
              }
              header {
                text-align: center;
                border: 2px solid #000;
                margin-bottom: 13px;
                padding-bottom: 10px;
              }
              header h1 {
                font-size: 42px;
                margin: 0;
                border-bottom: 2px solid #000;
              }
              h5{
                text-align:center;
              }
              header p {
                margin: 5px 0;
                font-size: 14px;
              }
              .invoice-details {
                display: flex;
                justify-content: space-between;
                align-items: stretch; /* Ensure equal height */
                font-size: 14px;
                margin-top: -15px;
                margin-bottom: -21px;
                border: 2px solid #000; /* Single border for the entire section */
              }
              .invoice-details .left,
              .invoice-details .right {
                width: 50%;
                display: flex;
                align-items: center;
                padding-left: 10px;
              }
              .invoice-details .left p {
                margin: 0;
                padding-top: -10px;
                font-weight: bold;
                text-align: center;
              }
              .invoice-details .right table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom:18px;
              }
              .invoice-details .right th,
              .invoice-details .right td {
                border: 1px solid #000;
                text-align: left;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 0px;
                font-size: 12px;
              }
              th, td {
                border: 1px solid #000;
                padding: 2px; /* Reduced padding for rows */
                text-align: center;
              }
              th {
                background-color: #f2f2f2;
                font-size: 14px;
              }
              .taxable-value-row,
              .bank-details-row {
                font-weight: bold;
                text-align: right;
              }
              .taxable-value-row td:last-child,
              .bank-details-row td:last-child {
                text-align: center;
              }
              .receiver-signature-row {
                padding-top:15px;
                padding-bottom:15px;
              }
             
            </style>
          </head>
          <body>
            <h5>|| Shree ||</h5>
            <header>
              <h1>Spider Engineering Work</h1>
              <p>All Types of Threading, Fabrication Work, U Bolts, Foundation Bolt, Spring & Truck Body Parts</p>
              <p>G. No 344/2, A/p Kasurdi, Khe-Ba, Tal Bhor, Pune Bhor, Pune Kasurdi - 412205</p>
            </header>
    
            <div class="invoice-details">
              <div class="left">
                <p><strong>To:</strong> ${invoice.companyName}</p>
              </div>
              <div class="right">
                <table>
                  <tbody>
                    <tr>
                      <td><strong>Invoice No:</strong></td>
                      <td>${invoice.invoiceNumber}</td>
                    </tr>
                    <tr>
                      <td><strong>Date:</strong></td>
                      <td>${invoice.date}</td>
                    </tr>
                    <tr>
                      <td><strong>Place of Supply:</strong></td>
                      <td>Maharashtra</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
    
            <table>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Particulars</th>
                  <th>HSN/SAC</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items
                  .map(
                    (item, idx) => `
                    <tr>
                      <td>${idx + 1}</td>
                      <td>${item.name}</td>
                      <td>---</td>
                      <td>${item.quantity}</td>
                      <td>${item.rate}</td>
                      <td>${item.total}</td>
                    </tr>`
                  )
                  .join("")}
                ${emptyRows}
                <tr class="taxable-value-row">
                  <td colspan="5">Taxable Value of Services:</td>
                  <td>₹ ${invoice.grandTotal.toFixed(2)}</td>
                </tr>
                <tr class="bank-details-row">
                  <td colspan="6" style="text-align: right;">
                    <p><strong>Bank Transfer Details:</strong></p>
                    <p>A/C Name: Spider Engineering Work</p>
                    <p>Bank Name: THE KARAD URBAN CO-OP. BANK LTD., KARAD</p>
                    <p>Account No.: 1039016008898</p>
                    <p>IFSC: KUCB0488039</p>
                  </td>
                </tr>
                <tr class="receiver-signature-row">
                  <td colspan="6" style="padding-top:75px;text-align: left;padding-bottom:5px;font-size:16px">
                    <b>Receiver Signature:</b>
                  </td>
                </tr>
              </tbody>
            </table>
    
            <script>
              window.print();
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    };
    
    
    
    
    
    
    
    
    
  
    renderTable(); // Initial render of the table
  }
  
  
