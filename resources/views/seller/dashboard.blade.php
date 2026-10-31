@extends('layouts.storefront')
@section('title', 'Seller dashboard')
@section('content')
<section class="page-hero compact-hero"><div class="container d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3"><div><span class="eyebrow">STORE MANAGEMENT</span><h1>Seller <em>studio.</em></h1><p>Manage your product catalogue from one place.</p></div><span class="seller-live"><span></span> Seller access active</span></div></section>
<section class="section-space pt-4"><div class="container">
    <div class="row g-3 mb-5" data-seller-summary>
        <div class="col-6 col-lg-3"><div class="metric-card"><span>Total products</span><strong>—</strong></div></div>
        <div class="col-6 col-lg-3"><div class="metric-card"><span>Published</span><strong>—</strong></div></div>
        <div class="col-6 col-lg-3"><div class="metric-card"><span>Farm & garden</span><strong>—</strong></div></div>
        <div class="col-6 col-lg-3"><div class="metric-card"><span>Everyday goods</span><strong>—</strong></div></div>
    </div>
    <div class="seller-workspace">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"><div><span class="eyebrow">YOUR CATALOGUE</span><h2 class="mb-0">Products</h2></div><button class="btn btn-dark rounded-pill px-4" type="button" data-bs-toggle="collapse" data-bs-target="#productEditor">＋ Add a product</button></div>
        <div class="collapse mb-4" id="productEditor"><div class="editor-card">
            <div class="d-flex justify-content-between align-items-start gap-3 mb-3"><div><h4>Add a product</h4><p class="small text-secondary mb-0">Add product details and up to 8 product images.</p></div><span class="badge rounded-pill text-bg-light">New listing</span></div>
            <form id="sellerProductForm" enctype="multipart/form-data" novalidate>
                <div class="row g-3">
                    <div class="col-md-8"><label class="form-label" for="productNameInput">Product name</label><input class="form-control" id="productNameInput" name="name" required maxlength="180"></div>
                    <div class="col-md-4"><label class="form-label" for="productTypeInput">Product type</label><select class="form-select" id="productTypeInput" name="product_type" required><option value="agriculture">Farm & garden</option><option value="general">Everyday goods</option></select></div>
                    <div class="col-md-6"><label class="form-label" for="productCategoryInput">Category</label><select class="form-select" id="productCategoryInput" name="category_id" required><option value="">Choose a category</option></select></div>
                    <div class="col-md-3"><label class="form-label" for="productPriceInput">Price (₹)</label><input class="form-control" id="productPriceInput" name="price" type="number" min="0.01" step="0.01" required></div>
                    <div class="col-md-3"><label class="form-label" for="productOldPriceInput">Compare at (₹)</label><input class="form-control" id="productOldPriceInput" name="compare_at_price" type="number" min="0.01" step="0.01"></div>
                    <div class="col-md-4"><label class="form-label" for="productStockInput">Stock quantity</label><input class="form-control" id="productStockInput" name="stock" type="number" min="0" value="10" required></div>
                    <div class="col-md-8"><label class="form-label" for="productBrandInput">Brand / farm name</label><input class="form-control" id="productBrandInput" name="brand" maxlength="100"></div>
                    <div class="col-12"><label class="form-label" for="productShortInput">Short description</label><input class="form-control" id="productShortInput" name="short_description" maxlength="300"></div>
                    <div class="col-12"><label class="form-label" for="productDescriptionInput">Full description</label><textarea class="form-control" id="productDescriptionInput" name="description" rows="4" required maxlength="20000"></textarea></div>
                    <div class="col-md-7"><label class="form-label" for="productImagesInput">Product images (1–8)</label><input class="form-control" id="productImagesInput" name="images[]" type="file" accept="image/jpeg,image/png,image/webp" multiple required><div class="form-text">Images are converted to WebP in 320px, 640px and 1200px sizes.</div><div class="image-preview-row" data-upload-preview></div></div>
                    <div class="col-md-5"><label class="form-label" for="productVideoInput">Product video (optional)</label><input class="form-control" id="productVideoInput" name="video" type="file" accept="video/mp4,video/webm"><div class="form-text">MP4/WebM, maximum 50 MB.</div></div>
                    <div class="col-12"><div class="form-check"><input class="form-check-input" type="checkbox" id="productFeaturedInput" name="is_featured"><label class="form-check-label" for="productFeaturedInput">Feature this product on the homepage</label></div></div>
                </div>
                <div class="form-message mt-3" data-form-message role="alert"></div>
                <div class="d-flex justify-content-end gap-2 mt-4"><button class="btn btn-outline-secondary rounded-pill" type="reset">Clear</button><button class="btn btn-dark rounded-pill px-4" type="submit">Publish product</button></div>
            </form>
        </div></div>
        <div class="table-responsive"><table class="table align-middle seller-table"><thead><tr><th>Product</th><th>Type</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead><tbody data-seller-products><tr><td colspan="6" class="text-center py-5 text-secondary">Loading products…</td></tr></tbody></table></div>
    </div>
</div></section>
@endsection
