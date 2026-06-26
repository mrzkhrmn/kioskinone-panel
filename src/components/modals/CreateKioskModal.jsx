import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import SelectInput from "../SelectInput";
import {
  useCreateKioskMutation,
  useUpdateKioskMutation,
} from "../../store/api/kioskApi";
import {
  useGetParameterHospitalsQuery,
  useGetParameterDepartmentsQuery,
} from "../../store/api/kioskParameterApi";
import { useAppDispatch } from "../../store/hooks";
import { setLoading } from "../../store/slices/loadingSlice";

const CreateKioskModal = ({ isOpen, onClose, onSuccess, kiosk }) => {
  const dispatch = useAppDispatch();
  const isEditMode = !!kiosk;
  const [formData, setFormData] = useState({
    id: null,
    hospitalId: null,
    departmentId: null,
    code: "",
    name: "",
    isActive: true,
  });

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const { data: hospitals } = useGetParameterHospitalsQuery();
  const { data: departments } = useGetParameterDepartmentsQuery(
    { hospitalId: selectedHospital?.value },
    {
      skip: !selectedHospital,
    }
  );

  const [createKiosk, { isLoading: isCreating }] = useCreateKioskMutation();
  const [updateKiosk, { isLoading: isUpdating }] = useUpdateKioskMutation();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (kiosk && isOpen) {
      setFormData({
        id: kiosk.id,
        hospitalId: kiosk.hospitalId,
        departmentId: kiosk.departmentId,
        code: kiosk.code || "",
        name: kiosk.name || "",
        isActive: kiosk.isActive !== undefined ? kiosk.isActive : true,
      });
      const hospital = hospitals?.data?.find((h) => h.id === kiosk.hospitalId);
      if (hospital) {
        setSelectedHospital({
          value: hospital.id,
          label: hospital.name,
        });
      }
    } else if (!kiosk && isOpen) {
      setFormData({
        id: null,
        hospitalId: null,
        departmentId: null,
        code: "",
        name: "",
        isActive: true,
      });
      setSelectedHospital(null);
      setSelectedDepartment(null);
    }
  }, [kiosk, isOpen, hospitals]);

  useEffect(() => {
    if (kiosk && isOpen && departments?.data && selectedHospital) {
      const department = departments.data.find(
        (d) => d.id === kiosk.departmentId
      );
      if (department) {
        setSelectedDepartment({
          value: department.id,
          label: department.name,
        });
      }
    }
  }, [kiosk, isOpen, departments, selectedHospital]);

  const handleHospitalChange = (option) => {
    setSelectedHospital(option);
    setSelectedDepartment(null);
    setFormData((prev) => ({
      ...prev,
      hospitalId: option?.value || null,
      departmentId: null,
    }));
  };

  const handleDepartmentChange = (option) => {
    setSelectedDepartment(option);
    setFormData((prev) => ({
      ...prev,
      departmentId: option?.value || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.hospitalId ||
      !formData.departmentId ||
      !formData.code ||
      !formData.name
    ) {
      alert("Lütfen tüm alanları doldurun");
      return;
    }

    try {
      dispatch(setLoading(true));
      if (isEditMode) {
        await updateKiosk({
          id: formData.id,
          hospitalId: formData.hospitalId,
          departmentId: formData.departmentId,
          code: formData.code,
          name: formData.name,
          isActive: formData.isActive,
        }).unwrap();
      } else {
        await createKiosk({
          hospitalId: formData.hospitalId,
          departmentId: formData.departmentId,
          code: formData.code,
          name: formData.name,
          isActive: formData.isActive,
        }).unwrap();
      }

      setFormData({
        id: null,
        hospitalId: null,
        departmentId: null,
        code: "",
        name: "",
        isActive: true,
      });
      setSelectedHospital(null);
      setSelectedDepartment(null);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(
        `Kiosk ${isEditMode ? "güncelleme" : "oluşturma"} hatası:`,
        error
      );
      alert(
        `Kiosk ${
          isEditMode ? "güncellenirken" : "oluşturulurken"
        } bir hata oluştu`
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClose = () => {
    setFormData({
      hospitalId: null,
      departmentId: null,
      code: "",
      name: "",
      isActive: true,
    });
    setSelectedHospital(null);
    setSelectedDepartment(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Kiosk Düzenle" : "Yeni Kiosk Ekle"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput
              label="Hastane *"
              options={hospitals?.data?.map((hospital) => ({
                value: hospital.id,
                label: hospital.name,
              }))}
              value={selectedHospital}
              onChange={handleHospitalChange}
              placeholder="Hastane seçiniz"
              isClearable={false}
            />

            <SelectInput
              label="Departman *"
              options={departments?.data?.map((department) => ({
                value: department.id,
                label: department.name,
              }))}
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              placeholder="Departman seçiniz"
              isClearable={false}
              isDisabled={!selectedHospital}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kod *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, code: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Kiosk kodu giriniz"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Kiosk adı giriniz"
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">Aktif</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? isEditMode
                  ? "Güncelleniyor..."
                  : "Kaydediliyor..."
                : isEditMode
                ? "Güncelle"
                : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateKioskModal;
