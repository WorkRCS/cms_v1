@extends('layouts.storefront')
@section('title', 'My account')
@section('robots', 'noindex,nofollow')
@section('content')
<section class="page-hero compact-hero">
    <div class="container">
        <span class="eyebrow">YOUR ACCOUNT</span>
        <h1>Hello, <em>there.</em></h1>
        <p>Manage your profile and saved delivery address.</p>
    </div>
</section>

<section class="section-space pt-4">
    <div class="container">
        <div class="account-card mb-4">
            <div class="account-avatar"><svg class="icon"><use href="#i-user"/></svg></div>
            <div class="flex-grow-1 min-w-0">
                <h3 data-account-name>Loading account…</h3>
                <p class="text-secondary mb-0" data-account-email></p>
                <span class="badge text-bg-light mt-2" data-account-role>Customer</span>
            </div>
            <button class="btn btn-outline-dark rounded-pill" type="button" data-logout>Sign out</button>
        </div>

        <div class="account-form-card">
            <div class="account-form-heading">
                <span class="eyebrow">PERSONAL DETAILS</span>
                <h2>My <em>profile.</em></h2>
                <p>Your details are private and can be changed whenever you need.</p>
            </div>

            <form id="profileForm" novalidate>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label" for="profileName">Full name</label>
                        <input class="form-control" id="profileName" name="name" type="text" maxlength="120" autocomplete="name" placeholder="Your name">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="profilePhone">Mobile number</label>
                        <input class="form-control" id="profilePhone" name="phone" type="tel" maxlength="30" autocomplete="tel" inputmode="tel" placeholder="Optional phone number">
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="profileEmail">Email address</label>
                        <input class="form-control" id="profileEmail" type="email" readonly aria-describedby="emailHelp">
                        <div class="form-text" id="emailHelp">Email address is used for sign-in and is not changed here.</div>
                    </div>
                </div>

                <div class="account-address-heading mt-5">
                    <span class="eyebrow">INDIA DELIVERY ADDRESS</span>
                    <h2>My <em>address.</em></h2>
                    <p>Add the details you want to keep for future delivery. Every address field is optional.</p>
                </div>

                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label" for="addressLabel">Address label</label>
                        <select class="form-select" id="addressLabel" name="address.label">
                            <option value="">Choose a label (optional)</option>
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label" for="addressFullName">Receiver's name</label>
                        <input class="form-control" id="addressFullName" name="address.full_name" type="text" maxlength="120" autocomplete="name" placeholder="Name on the parcel">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label" for="addressPhone">Receiver's mobile</label>
                        <input class="form-control" id="addressPhone" name="address.phone" type="tel" maxlength="30" autocomplete="tel" inputmode="tel" placeholder="Optional mobile number">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="addressHouse">House / Flat / Building</label>
                        <input class="form-control" id="addressHouse" name="address.house_flat" type="text" maxlength="160" autocomplete="address-line1" placeholder="Flat, house number, building">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="addressStreet">Street / Road / Area</label>
                        <input class="form-control" id="addressStreet" name="address.street_area" type="text" maxlength="180" autocomplete="address-line2" placeholder="Street, road or area">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="addressLandmark">Landmark</label>
                        <input class="form-control" id="addressLandmark" name="address.landmark" type="text" maxlength="160" placeholder="Nearby landmark (optional)">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="addressLocality">Locality / Neighbourhood</label>
                        <input class="form-control" id="addressLocality" name="address.locality" type="text" maxlength="160" autocomplete="address-level3" placeholder="Locality or neighbourhood">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label" for="addressCity">City / Town / Village</label>
                        <input class="form-control" id="addressCity" name="address.city" type="text" maxlength="120" autocomplete="address-level2" placeholder="City, town or village">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label" for="addressDistrict">District</label>
                        <input class="form-control" id="addressDistrict" name="address.district" type="text" maxlength="120" placeholder="District">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label" for="addressState">State / Union Territory</label>
                        <select class="form-select" id="addressState" name="address.state" autocomplete="address-level1">
                            <option value="">Choose state / UT (optional)</option>
                            <option>Andhra Pradesh</option><option>Arunachal Pradesh</option><option>Assam</option><option>Bihar</option><option>Chhattisgarh</option><option>Goa</option><option>Gujarat</option><option>Haryana</option><option>Himachal Pradesh</option><option>Jharkhand</option><option>Karnataka</option><option>Kerala</option><option>Madhya Pradesh</option><option>Maharashtra</option><option>Manipur</option><option>Meghalaya</option><option>Mizoram</option><option>Nagaland</option><option>Odisha</option><option>Punjab</option><option>Rajasthan</option><option>Sikkim</option><option>Tamil Nadu</option><option>Telangana</option><option>Tripura</option><option>Uttar Pradesh</option><option>Uttarakhand</option><option>West Bengal</option>
                            <option>Andaman and Nicobar Islands</option><option>Chandigarh</option><option>Dadra and Nagar Haveli and Daman and Diu</option><option>Delhi</option><option>Jammu and Kashmir</option><option>Ladakh</option><option>Lakshadweep</option><option>Puducherry</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="addressPin">PIN Code</label>
                        <input class="form-control" id="addressPin" name="address.postal_code" type="text" maxlength="6" inputmode="numeric" autocomplete="postal-code" placeholder="6-digit PIN code">
                        <div class="form-text">For India, enter a 6-digit PIN code. This field is optional.</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="addressCountry">Country</label>
                        <input class="form-control" id="addressCountry" name="address.country" type="text" maxlength="80" autocomplete="country-name" value="India" placeholder="Country (optional)">
                    </div>
                </div>

                <div class="account-optional-note mt-4">
                    <svg class="icon"><use href="#i-shield"/></svg>
                    <span>সব ফিল্ড Optional। যতটুকু তথ্য দেবেন, ততটুকুই আপনার প্রোফাইলে সেভ হবে। পরে চাইলে পরিবর্তন করতে পারবেন।</span>
                </div>

                <div class="form-message mt-3" data-form-message role="status" aria-live="polite"></div>
                <div class="d-flex justify-content-end mt-3">
                    <button class="btn btn-dark rounded-pill px-4" type="submit">Save profile & address</button>
                </div>
            </form>
        </div>

        <div class="row g-4 mt-2">
            <div class="col-md-6">
                <div class="account-feature">
                    <h5>My orders</h5>
                    <p>Order history and tracking will appear here when the order backend is connected.</p>
                    <span class="text-secondary small">Coming in the next milestone</span>
                </div>
            </div>
            <div class="col-md-6">
                <div class="account-feature">
                    <h5>Saved addresses</h5>
                    <p>Your address details are saved privately with your account for future checkout use.</p>
                    <span class="text-secondary small">One profile delivery address</span>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
