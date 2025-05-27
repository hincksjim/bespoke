"use client"

import { useState, useEffect } from "react"
import { Save, Send, Plus, Minus, Calculator, ImageIcon, FileText } from "lucide-react"
import "./quote-generator.css"

// This component handles the creation and editing of quotes.
// It includes fields for client information, item details, materials, labor, and pricing.

export default function QuoteGenerator({ quoteRequest = null, onSave, onSend }) {
  // Initialize form with default values or quote request data if editing
  const [formData, setFormData] = useState({
    // Client Information
    clientName: quoteRequest?.clientName || "",
    clientEmail: quoteRequest?.clientEmail || "",
    clientPhone: quoteRequest?.clientPhone || "",

    // Item Details
    itemName: quoteRequest?.itemName || "",
    itemType: quoteRequest?.itemType || "ring",
    itemDescription: quoteRequest?.description || "",

    // Materials
    materials: quoteRequest?.materials
      ? [...quoteRequest.materials]
      : [{ name: "", quantity: 1, unit: "g", unitPrice: 0, totalPrice: 0 }],

    // Labor
    laborHours: quoteRequest?.laborHours || 0,
    hourlyRate: quoteRequest?.hourlyRate || 75,
    laborCost: quoteRequest?.laborCost || 0,

    // Additional Fees
    additionalFees: quoteRequest?.additionalFees ? [...quoteRequest.additionalFees] : [{ description: "", amount: 0 }],

    // Pricing
    subtotal: 0,
    taxRate: 0.07,
    taxAmount: 0,
    discount: 0,
    discountType: "percentage", // percentage or fixed
    discountAmount: 0,
    totalPrice: 0,

    // Delivery
    estimatedDelivery: quoteRequest?.estimatedDelivery || "",
    deliveryNotes: quoteRequest?.deliveryNotes || "",

    // Quote Details
    quoteNumber: quoteRequest?.quoteNumber || generateQuoteNumber(),
    quoteDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: quoteRequest?.notes || "",
  })

  // Generate a random quote number
  function generateQuoteNumber() {
    const prefix = "QT"
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `${prefix}-${timestamp}-${random}`
  }

  // Calculate material costs
  const calculateMaterialCost = (material) => {
    return material.quantity * material.unitPrice
  }

  // Add a new material row
  const addMaterial = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, { name: "", quantity: 1, unit: "g", unitPrice: 0, totalPrice: 0 }],
    })
  }

  // Remove a material row
  const removeMaterial = (index) => {
    if (formData.materials.length > 1) {
      const updatedMaterials = [...formData.materials]
      updatedMaterials.splice(index, 1)
      setFormData({
        ...formData,
        materials: updatedMaterials,
      })
    }
  }

  // Update material field
  const updateMaterial = (index, field, value) => {
    const updatedMaterials = [...formData.materials]

    // Convert numeric values
    if (field === "quantity" || field === "unitPrice") {
      value = Number.parseFloat(value) || 0
    }

    updatedMaterials[index][field] = value

    // Calculate total price for this material
    updatedMaterials[index].totalPrice = calculateMaterialCost(updatedMaterials[index])

    setFormData({
      ...formData,
      materials: updatedMaterials,
    })
  }

  // Add a new fee row
  const addFee = () => {
    setFormData({
      ...formData,
      additionalFees: [...formData.additionalFees, { description: "", amount: 0 }],
    })
  }

  // Remove a fee row
  const removeFee = (index) => {
    if (formData.additionalFees.length > 1) {
      const updatedFees = [...formData.additionalFees]
      updatedFees.splice(index, 1)
      setFormData({
        ...formData,
        additionalFees: updatedFees,
      })
    }
  }

  // Update fee field
  const updateFee = (index, field, value) => {
    const updatedFees = [...formData.additionalFees]

    // Convert numeric values
    if (field === "amount") {
      value = Number.parseFloat(value) || 0
    }

    updatedFees[index][field] = value

    setFormData({
      ...formData,
      additionalFees: updatedFees,
    })
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type } = e.target

    // Convert numeric values
    let processedValue = value
    if (type === "number") {
      processedValue = Number.parseFloat(value) || 0
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    })
  }

  // Calculate labor cost
  const calculateLaborCost = () => {
    return formData.laborHours * formData.hourlyRate
  }

  // Calculate discount amount
  const calculateDiscountAmount = (subtotal) => {
    if (formData.discountType === "percentage") {
      return subtotal * (formData.discount / 100)
    } else {
      return formData.discount
    }
  }

  // Calculate all totals
  const calculateTotals = () => {
    // Calculate materials total
    const materialsCost = formData.materials.reduce((total, material) => {
      return total + calculateMaterialCost(material)
    }, 0)

    // Calculate labor cost
    const laborCost = calculateLaborCost()

    // Calculate additional fees total
    const feesTotal = formData.additionalFees.reduce((total, fee) => {
      return total + fee.amount
    }, 0)

    // Calculate subtotal
    const subtotal = materialsCost + laborCost + feesTotal

    // Calculate discount
    const discountAmount = calculateDiscountAmount(subtotal)

    // Calculate tax
    const taxableAmount = subtotal - discountAmount
    const taxAmount = taxableAmount * formData.taxRate

    // Calculate total
    const totalPrice = taxableAmount + taxAmount

    return {
      laborCost,
      subtotal,
      discountAmount,
      taxAmount,
      totalPrice,
    }
  }

  // Update calculations when form data changes
  useEffect(() => {
    const { laborCost, subtotal, discountAmount, taxAmount, totalPrice } = calculateTotals()

    setFormData((prevData) => ({
      ...prevData,
      laborCost,
      subtotal,
      discountAmount,
      taxAmount,
      totalPrice,
    }))
  }, [
    formData.materials,
    formData.laborHours,
    formData.hourlyRate,
    formData.additionalFees,
    formData.discount,
    formData.discountType,
    formData.taxRate,
    formData.calculateTotals,
  ])

  // Handle form submission
  const handleSubmit = (e, action) => {
    e.preventDefault()

    // Create the final quote object
    const quoteData = {
      ...formData,
      status: action === "save" ? "draft" : "sent",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Call the appropriate handler
    if (action === "save") {
      onSave && onSave(quoteData)
    } else if (action === "send") {
      onSend && onSend(quoteData)
    }

    // For demo purposes, log the data
    console.log("Quote Data:", quoteData)
    alert(`Quote ${action === "save" ? "saved as draft" : "sent to client"}!`)
  }

  return (
    <div className="quote-generator">
      <div className="quote-generator-header">
        <h2 className="quote-generator-title">Generate Quote</h2>
        <div className="quote-generator-actions">
          <button type="button" className="quote-action-button save-button" onClick={(e) => handleSubmit(e, "save")}>
            <Save className="button-icon" />
            Save Draft
          </button>
          <button type="button" className="quote-action-button send-button" onClick={(e) => handleSubmit(e, "send")}>
            <Send className="button-icon" />
            Send to Client
          </button>
        </div>
      </div>

      <form className="quote-form">
        <div className="quote-form-grid">
          {/* Left Column */}
          <div className="quote-form-column">
            {/* Client Information */}
            <section className="quote-section">
              <h3 className="section-title">Client Information</h3>
              <div className="form-group">
                <label htmlFor="clientName" className="form-label">
                  Client Name
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="clientEmail" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="clientEmail"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="clientPhone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="clientPhone"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </section>

            {/* Item Details */}
            <section className="quote-section">
              <h3 className="section-title">Item Details</h3>
              <div className="form-group">
                <label htmlFor="itemName" className="form-label">
                  Item Name
                </label>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="itemType" className="form-label">
                  Item Type
                </label>
                <select
                  id="itemType"
                  name="itemType"
                  value={formData.itemType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="ring">Ring</option>
                  <option value="necklace">Necklace</option>
                  <option value="bracelet">Bracelet</option>
                  <option value="earrings">Earrings</option>
                  <option value="pendant">Pendant</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="itemDescription" className="form-label">
                  Description
                </label>
                <textarea
                  id="itemDescription"
                  name="itemDescription"
                  value={formData.itemDescription}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Add Images</label>
                <button type="button" className="upload-button">
                  <ImageIcon className="button-icon" />
                  Upload Images
                </button>
              </div>
            </section>

            {/* Labor */}
            <section className="quote-section">
              <h3 className="section-title">Labor</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="laborHours" className="form-label">
                    Hours
                  </label>
                  <input
                    type="number"
                    id="laborHours"
                    name="laborHours"
                    value={formData.laborHours}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="hourlyRate" className="form-label">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    id="hourlyRate"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    min="0"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="laborCost" className="form-label">
                    Labor Cost ($)
                  </label>
                  <input
                    type="number"
                    id="laborCost"
                    name="laborCost"
                    value={formData.laborCost.toFixed(2)}
                    readOnly
                    className="form-input readonly"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="quote-form-column">
            {/* Materials */}
            <section className="quote-section">
              <div className="section-header">
                <h3 className="section-title">Materials</h3>
                <button type="button" className="add-button" onClick={addMaterial}>
                  <Plus className="button-icon-small" />
                  Add Material
                </button>
              </div>

              <div className="materials-list">
                <div className="materials-header">
                  <div className="material-name-header">Material</div>
                  <div className="material-quantity-header">Qty</div>
                  <div className="material-unit-header">Unit</div>
                  <div className="material-price-header">Price ($)</div>
                  <div className="material-total-header">Total ($)</div>
                  <div className="material-action-header"></div>
                </div>

                {formData.materials.map((material, index) => (
                  <div className="material-row" key={index}>
                    <div className="material-name">
                      <input
                        type="text"
                        value={material.name}
                        onChange={(e) => updateMaterial(index, "name", e.target.value)}
                        placeholder="e.g. 14K Gold"
                        className="form-input"
                      />
                    </div>

                    <div className="material-quantity">
                      <input
                        type="number"
                        value={material.quantity}
                        onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                        min="0"
                        step="0.01"
                        className="form-input"
                      />
                    </div>

                    <div className="material-unit">
                      <select
                        value={material.unit}
                        onChange={(e) => updateMaterial(index, "unit", e.target.value)}
                        className="form-select"
                      >
                        <option value="g">g</option>
                        <option value="ct">ct</option>
                        <option value="oz">oz</option>
                        <option value="pc">pc</option>
                      </select>
                    </div>

                    <div className="material-price">
                      <input
                        type="number"
                        value={material.unitPrice}
                        onChange={(e) => updateMaterial(index, "unitPrice", e.target.value)}
                        min="0"
                        step="0.01"
                        className="form-input"
                      />
                    </div>

                    <div className="material-total">
                      <input
                        type="number"
                        value={material.totalPrice.toFixed(2)}
                        readOnly
                        className="form-input readonly"
                      />
                    </div>

                    <div className="material-action">
                      <button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        className="remove-button"
                        disabled={formData.materials.length <= 1}
                      >
                        <Minus className="button-icon-small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Additional Fees */}
            <section className="quote-section">
              <div className="section-header">
                <h3 className="section-title">Additional Fees</h3>
                <button type="button" className="add-button" onClick={addFee}>
                  <Plus className="button-icon-small" />
                  Add Fee
                </button>
              </div>

              <div className="fees-list">
                {formData.additionalFees.map((fee, index) => (
                  <div className="fee-row" key={index}>
                    <div className="fee-description">
                      <input
                        type="text"
                        value={fee.description}
                        onChange={(e) => updateFee(index, "description", e.target.value)}
                        placeholder="e.g. Shipping"
                        className="form-input"
                      />
                    </div>

                    <div className="fee-amount">
                      <input
                        type="number"
                        value={fee.amount}
                        onChange={(e) => updateFee(index, "amount", e.target.value)}
                        min="0"
                        step="0.01"
                        className="form-input"
                      />
                    </div>

                    <div className="fee-action">
                      <button
                        type="button"
                        onClick={() => removeFee(index)}
                        className="remove-button"
                        disabled={formData.additionalFees.length <= 1}
                      >
                        <Minus className="button-icon-small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Pricing */}
            <section className="quote-section">
              <h3 className="section-title">Pricing</h3>

              <div className="pricing-row">
                <div className="pricing-label">Subtotal:</div>
                <div className="pricing-value">${formData.subtotal.toFixed(2)}</div>
              </div>

              <div className="form-row discount-row">
                <div className="form-group discount-type">
                  <label htmlFor="discountType" className="form-label">
                    Discount Type
                  </label>
                  <select
                    id="discountType"
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div className="form-group discount-value">
                  <label htmlFor="discount" className="form-label">
                    Discount {formData.discountType === "percentage" ? "(%)" : "($)"}
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    min="0"
                    className="form-input"
                  />
                </div>

                <div className="form-group discount-amount">
                  <label htmlFor="discountAmount" className="form-label">
                    Discount Amount ($)
                  </label>
                  <input
                    type="number"
                    id="discountAmount"
                    name="discountAmount"
                    value={formData.discountAmount.toFixed(2)}
                    readOnly
                    className="form-input readonly"
                  />
                </div>
              </div>

              <div className="form-row tax-row">
                <div className="form-group tax-rate">
                  <label htmlFor="taxRate" className="form-label">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    id="taxRate"
                    name="taxRate"
                    value={formData.taxRate * 100}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        taxRate: Number.parseFloat(e.target.value) / 100 || 0,
                      })
                    }
                    min="0"
                    max="100"
                    step="0.1"
                    className="form-input"
                  />
                </div>

                <div className="form-group tax-amount">
                  <label htmlFor="taxAmount" className="form-label">
                    Tax Amount ($)
                  </label>
                  <input
                    type="number"
                    id="taxAmount"
                    name="taxAmount"
                    value={formData.taxAmount.toFixed(2)}
                    readOnly
                    className="form-input readonly"
                  />
                </div>
              </div>

              <div className="pricing-row total-row">
                <div className="pricing-label total-label">Total Price:</div>
                <div className="pricing-value total-value">${formData.totalPrice.toFixed(2)}</div>
              </div>
            </section>

            {/* Delivery */}
            <section className="quote-section">
              <h3 className="section-title">Delivery Information</h3>

              <div className="form-group">
                <label htmlFor="estimatedDelivery" className="form-label">
                  Estimated Delivery Date
                </label>
                <input
                  type="date"
                  id="estimatedDelivery"
                  name="estimatedDelivery"
                  value={formData.estimatedDelivery}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="deliveryNotes" className="form-label">
                  Delivery Notes
                </label>
                <textarea
                  id="deliveryNotes"
                  name="deliveryNotes"
                  value={formData.deliveryNotes}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="2"
                ></textarea>
              </div>
            </section>
          </div>
        </div>

        {/* Quote Details */}
        <section className="quote-section full-width">
          <h3 className="section-title">Quote Details</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quoteNumber" className="form-label">
                Quote Number
              </label>
              <input
                type="text"
                id="quoteNumber"
                name="quoteNumber"
                value={formData.quoteNumber}
                readOnly
                className="form-input readonly"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quoteDate" className="form-label">
                Quote Date
              </label>
              <input
                type="date"
                id="quoteDate"
                name="quoteDate"
                value={formData.quoteDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="expiryDate" className="form-label">
                Valid Until
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-textarea"
              rows="3"
              placeholder="Add any additional notes or terms and conditions..."
            ></textarea>
          </div>
        </section>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="quote-action-button preview-button">
            <FileText className="button-icon" />
            Preview Quote
          </button>
          <button type="button" className="quote-action-button calculate-button">
            <Calculator className="button-icon" />
            Recalculate
          </button>
          <button type="button" className="quote-action-button save-button" onClick={(e) => handleSubmit(e, "save")}>
            <Save className="button-icon" />
            Save Draft
          </button>
          <button type="button" className="quote-action-button send-button" onClick={(e) => handleSubmit(e, "send")}>
            <Send className="button-icon" />
            Send to Client
          </button>
        </div>
      </form>
    </div>
  )
}
