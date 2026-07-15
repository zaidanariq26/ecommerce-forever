import { useState, useEffect, useMemo } from "react";
import { Country, State, City } from "country-state-city";
import Title from "../components/Title";
import useAuthStore from "../zustand/authStore";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import SEO from "../components/SEO";
import PhoneInput from "../components/ui/PhoneInput";
import AutocompleteInput from "../components/ui/AutocompleteInput";

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
    },
  });

  const allCountries = useMemo(() => Country.getAllCountries(), []);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const states = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry.isoCode);
  }, [selectedCountry]);

  const cities = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(
      selectedCountry.isoCode,
      selectedState.isoCode,
    );
  }, [selectedCountry, selectedState]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/user/profile");
        if (response.data.success) {
          const { firstName, lastName, phone, address } = response.data.user;
          setFormData({
            firstName: firstName || "",
            lastName: lastName || "",
            phone: phone || "",
            address: {
              street: address?.street || "",
              city: address?.city || "",
              state: address?.state || "",
              country: address?.country || "",
              zipcode: address?.zipcode || "",
            },
          });

          // Restore selected country/state from saved data
          if (address?.country) {
            const country = allCountries.find(
              (c) => c.name === address.country,
            );
            if (country) {
              setSelectedCountry(country);
              if (address?.state) {
                const stateList = State.getStatesOfCountry(country.isoCode);
                const state = stateList.find((s) => s.name === address.state);
                if (state) setSelectedState(state);
              }
            }
          }
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [allCountries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleCountryChange = (countryName) => {
    const country = allCountries.find((c) => c.name === countryName);
    setSelectedCountry(country || null);
    setSelectedState(null);
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, country: countryName, state: "", city: "" },
    }));
  };

  const handleStateChange = (stateName) => {
    const state = states.find((s) => s.name === stateName);
    setSelectedState(state || null);
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, state: stateName, city: "" },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    if (!/^[0-9]{7,15}$/.test(formData.phone.trim())) {
      toast.error(
        "Phone must be between 7 and 15 digits long (e.g., 0812345678)",
      );
      return;
    }

    const { country, state, city, zipcode } = formData.address;

    if (!country || !country.trim()) {
      toast.error("Country is required");
      return;
    }

    if (!selectedCountry) {
      toast.error("Please select a valid country from the list");
      return;
    }

    if (!state || !state.trim()) {
      toast.error("State is required");
      return;
    }

    if (!selectedState) {
      toast.error("Please select a valid state from the list");
      return;
    }

    if (!city || !city.trim()) {
      toast.error("City is required");
      return;
    }

    const cityMatch = cities.some(
      (c) => c.name.toLowerCase() === city.toLowerCase(),
    );
    if (!cityMatch) {
      toast.error("Please select a valid city from the list");
      return;
    }

    if (!zipcode || !zipcode.trim()) {
      toast.error("Zipcode is required");
      return;
    }

    if (!/^[a-zA-Z0-9\s\-]{1,10}$/.test(zipcode.trim())) {
      toast.error("Invalid zipcode format");
      return;
    }

    try {
      setSaving(true);
      const response = await api.put("/api/user/profile", formData);
      if (response.data.success) {
        toast.success(response.data.message);
        updateUser(response.data.user);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-10">
        <Loading type="spinner" size="text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 md:pt-10">
      <SEO title="My Profile" />
      <div className="mb-3 text-center">
        <Title text1={"MY"} text2={"PROFILE"} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-2xl flex-col gap-6"
      >
        {/* Personal Info */}
        <div>
          <p className="mb-4 text-lg font-medium text-gray-800">
            Personal Information
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full cursor-not-allowed border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400"
            />
            <p className="mt-1 text-xs text-gray-400">
              Email cannot be changed
            </p>
          </div>
          <div className="mt-4">
            <PhoneInput
              label="Phone"
              value={formData.phone}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, phone: value || "" }))
              }
            />
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Address */}
        <div>
          <p className="mb-4 text-lg font-medium text-gray-800">
            Saved Address
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm text-gray-600">Street</label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                placeholder="Street address"
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <AutocompleteInput
                label="Country"
                value={formData.address.country}
                onChange={handleCountryChange}
                options={allCountries.map((c) => c.name)}
                placeholder="Search country..."
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AutocompleteInput
                label="State"
                value={formData.address.state}
                onChange={handleStateChange}
                options={states.map((s) => s.name)}
                placeholder={
                  selectedCountry ? "Search state..." : "Select country first"
                }
                disabled={!selectedCountry}
              />
              <AutocompleteInput
                label="City"
                value={formData.address.city}
                onChange={(val) => handleAddressChange("city", val)}
                options={cities.map((c) => c.name)}
                placeholder={
                  selectedState ? "Search city..." : "Select state first"
                }
                disabled={!selectedState}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Zipcode
              </label>
              <input
                type="text"
                value={formData.address.zipcode}
                onChange={(e) => handleAddressChange("zipcode", e.target.value)}
                placeholder="Zipcode"
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pb-10">
          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer bg-gray-900 px-8 py-3 text-sm text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
