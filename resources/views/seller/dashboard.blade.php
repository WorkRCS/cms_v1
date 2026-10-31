@extends('layouts.storefront')
@section('title', 'Store admin dashboard')
@section('robots', 'noindex,nofollow')
@section('content')
<section class="page-hero compact-hero">
    <div class="container d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
        <div>
            <span class="eyebrow">STORE MANAGEMENT</span>
            <h1>Admin <em>studio.</em></h1>
            <p>Manage products and customer accounts from one secure workspace.</p>
        </div>
        <span class="seller-live"><span></span> Owner access active</span>
    </div>
</section>

<section class="section-space pt-4">
    <div class="container">
        <div class="row g-3 mb-4" data-seller-summary>
            <div class="col-6 col-lg-4"><div class="metric-card"><span>Total products</span><strong>—</strong></div></div>
            <div class="col-6 col-lg-4"><div class="metric-card"><span>Published products</span><strong>—</strong></div></div>
            <div class="col-6 col-lg-4"><div class="metric-card"><span>Total customers</span><strong>—</strong></div></div>
            <div class="col-6 col-lg-4"><div class="metric-card"><span>Active customer accounts</span><strong>—</strong></div></div>
            <div class="col-6 col-lg-4"><div class="metric-card"><span>Farm & garden</span><strong>—</strong></div></div>
            <div class="col-6 col-lg-4"><div class="metric-card"><span>Everyday goods</span><strong>—</strong></div></div>
        </div>

        <div class="admin-orders-note mb-5">
            <div>
                <span class="eyebrow">ORDERS</span>
                <h2 class="h5 mb-1">Order management is not enabled yet</h2>
                <p class="mb-0">Checkout is currently a preview and does not create or save orders. Order totals will appear here after order creation and secure order storage are implemented.</p>
            </div>
            <span class="badge text-bg-light">Preview only</span>
        </div>

        <div class="seller-workspace mb-5">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <span class="eyebrow">YOUR CATALOGUE</span>
                    <h2 class="mb-0">Products</h2>
                </div>
                <button class="btn btn-dark rounded-pill px-4" type="button" data-bs-toggle="modal" data-bs-target="#productEditor">＋ Add a product</button>
            </div>

            <div class="modal fade" id="productEditor" tabindex="-1" aria-labelledby="addProductModalTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                    <div class="modal-content admin-product-modal">
                        <div class="modal-header">
                            <div><span class="eyebrow">CATALOGUE MANAGEMENT</span><h2 class="modal-title h5" id="addProductModalTitle">Add a product</h2><p class="small text-secondary mb-0">Add product details and up to 8 product images.</p></div>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="editor-card">
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
                            <div class="col-md-7">
                                <label class="form-label" for="productYouTubeInput">YouTube video URL (optional)</label>
                                <input class="form-control" id="productYouTubeInput" name="video_youtube_url" type="url" inputmode="url" placeholder="https://www.youtube.com/watch?v=...">
                                <div class="form-text">Paste a YouTube video, Shorts, youtu.be or embed link. Shorts are detected automatically.</div>
                            </div>
                            <div class="col-md-5"><label class="form-label" for="productVideoTitleInput">Video title (optional)</label><input class="form-control" id="productVideoTitleInput" name="video_title" type="text" maxlength="180" placeholder="A short title for this video"></div>
                            <div class="col-md-5"><label class="form-label" for="productVideoLayoutInput">Video layout</label><select class="form-select" id="productVideoLayoutInput" name="video_layout"><option value="auto" selected>Automatic (detect Shorts)</option><option value="shorts">Vertical Shorts (9:16)</option><option value="standard">Landscape video (16:9)</option></select></div>
                            <div class="col-md-7"><label class="form-label" for="productVideoInput">Or upload a video file</label><input class="form-control" id="productVideoInput" name="video" type="file" accept="video/mp4,video/webm"><div class="form-text">MP4/WebM, maximum 50 MB. Use either a YouTube link or an upload, not both.</div></div>
                            <div class="col-12"><div class="form-check"><input class="form-check-input" type="checkbox" id="productFeaturedInput" name="is_featured"><label class="form-check-label" for="productFeaturedInput">Feature this product on the homepage</label></div></div>
                        </div>
                        <div class="form-message mt-3" data-form-message role="alert"></div>
                        <div class="d-flex justify-content-end gap-2 mt-4"><button class="btn btn-outline-secondary rounded-pill" type="reset">Clear</button><button class="btn btn-dark rounded-pill px-4" type="submit">Publish product</button></div>
                    </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table align-middle seller-table">
                    <thead><tr><th>Product</th><th>Type</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody data-seller-products><tr><td colspan="6" class="text-center py-5 text-secondary">Loading products…</td></tr></tbody>
                </table>
            </div>
            <nav class="mt-3" aria-label="Product pages"><ul class="pagination justify-content-center" data-seller-product-pagination></ul></nav>
        </div>

        <div class="seller-workspace">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
                <div><span class="eyebrow">CUSTOMER ACCOUNTS</span><h2 class="mb-0">Customers</h2><p class="small text-secondary mb-0">Account status means enabled or disabled, not live online presence.</p></div>
                <div class="admin-customer-search"><label class="visually-hidden" for="adminCustomerSearch">Search customers</label><input class="form-control" type="search" id="adminCustomerSearch" placeholder="Search name or email"></div>
            </div>
            <div class="table-responsive">
                <table class="table align-middle seller-table">
                    <thead><tr><th>Customer</th><th>Email</th><th>Phone</th><th>Delivery address</th><th>Account status</th><th>Joined</th></tr></thead>
                    <tbody data-admin-customers><tr><td colspan="6" class="text-center py-5 text-secondary">Loading customers…</td></tr></tbody>
                </table>
            </div>
            <nav class="mt-3" aria-label="Customer pages"><ul class="pagination justify-content-center" data-admin-customer-pagination></ul></nav>
        </div>
    </div>
</section>

<div class="modal fade" id="editProductModal" tabindex="-1" aria-labelledby="editProductModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header"><div><span class="eyebrow">CATALOGUE MANAGEMENT</span><h2 class="modal-title h5" id="editProductModalTitle">Edit product</h2></div><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
            <div class="modal-body">
                <form id="editProductForm" enctype="multipart/form-data" novalidate>
                    <input type="hidden" name="id" id="editProductId">
                    <div class="row g-3">
                        <div class="col-md-8"><label class="form-label" for="editProductName">Product name</label><input class="form-control" name="name" id="editProductName" maxlength="180" required></div>
                        <div class="col-md-4"><label class="form-label" for="editProductType">Product type</label><select class="form-select" name="product_type" id="editProductType" required><option value="agriculture">Farm & garden</option><option value="general">Everyday goods</option></select></div>
                        <div class="col-md-6"><label class="form-label" for="editProductCategory">Category</label><select class="form-select" name="category_id" id="editProductCategory" required></select></div>
                        <div class="col-md-3"><label class="form-label" for="editProductPrice">Price (₹)</label><input class="form-control" name="price" id="editProductPrice" type="number" min="0.01" step="0.01" required></div>
                        <div class="col-md-3"><label class="form-label" for="editProductComparePrice">Compare at (₹)</label><input class="form-control" name="compare_at_price" id="editProductComparePrice" type="number" min="0.01" step="0.01"></div>
                        <div class="col-md-4"><label class="form-label" for="editProductStock">Stock quantity</label><input class="form-control" name="stock" id="editProductStock" type="number" min="0" required></div>
                        <div class="col-md-8"><label class="form-label" for="editProductBrand">Brand / farm name</label><input class="form-control" name="brand" id="editProductBrand" maxlength="100"></div>
                        <div class="col-12"><label class="form-label" for="editProductShort">Short description</label><input class="form-control" name="short_description" id="editProductShort" maxlength="300"></div>
                        <div class="col-12"><label class="form-label" for="editProductDescription">Full description</label><textarea class="form-control" name="description" id="editProductDescription" rows="4" maxlength="20000" required></textarea></div>
                        <div class="col-md-6"><label class="form-label" for="editProductImages">Replace/add product images (optional)</label><input class="form-control" name="images[]" id="editProductImages" type="file" accept="image/jpeg,image/png,image/webp" multiple><div class="form-text">Selecting images replaces the current gallery. Select 1–8 files.</div></div>
                        <div class="col-md-6"><label class="form-label" for="editProductStatus">Status</label><select class="form-select" name="status" id="editProductStatus"><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></div>
                        <div class="col-md-7"><label class="form-label" for="editProductVideoUrl">Replace with YouTube URL (optional)</label><input class="form-control" name="video_youtube_url" id="editProductVideoUrl" type="url" maxlength="500"></div>
                        <div class="col-md-5"><label class="form-label" for="editProductVideoTitle">Video title</label><input class="form-control" name="video_title" id="editProductVideoTitle" maxlength="180"></div>
                        <div class="col-md-5"><label class="form-label" for="editProductVideoLayout">Video layout</label><select class="form-select" name="video_layout" id="editProductVideoLayout"><option value="auto">Automatic</option><option value="shorts">Shorts 9:16</option><option value="standard">Landscape 16:9</option></select></div>
                        <div class="col-md-7"><label class="form-label" for="editProductVideoFile">Replace with video file (optional)</label><input class="form-control" name="video" id="editProductVideoFile" type="file" accept="video/mp4,video/webm"></div>
                        <div class="col-12"><div class="form-check"><input class="form-check-input" type="checkbox" name="remove_video" id="editProductRemoveVideo" value="1"><label class="form-check-label" for="editProductRemoveVideo">Remove current product video</label></div></div>
                        <div class="col-12"><div class="form-check"><input class="form-check-input" type="checkbox" name="is_featured" id="editProductFeatured" value="1"><label class="form-check-label" for="editProductFeatured">Feature this product on the homepage</label></div></div>
                    </div>
                    <div class="form-message mt-3" data-edit-form-message role="alert"></div>
                    <div class="d-flex justify-content-end gap-2 mt-4"><button type="button" class="btn btn-outline-secondary rounded-pill" data-bs-dismiss="modal">Cancel</button><button type="submit" class="btn btn-dark rounded-pill px-4">Save changes</button></div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
