export function getProductPricing(product) {
  const price = Number(product?.Price) || 0;
  const finalPriceRaw =
    product?.FinalPrice ?? product?.SalePrice ?? product?.finalPrice ?? null;
  const parsedFinal = Number(finalPriceRaw);
  const finalPrice =
    Number.isFinite(parsedFinal) && parsedFinal > 0 ? parsedFinal : price;

  let discountPercent = 0;
  if (price > 0 && finalPrice < price) {
    discountPercent = Math.round(((price - finalPrice) / price) * 100);
  }

  return {
    price,
    finalPrice,
    discountPercent,
    hasDiscount: discountPercent > 0,
  };
}
