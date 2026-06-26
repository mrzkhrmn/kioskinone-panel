import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import SelectInput from "../components/SelectInput";
import CreateKioskModal from "../components/modals/CreateKioskModal";
import {
  useGetParameterDepartmentsQuery,
  useGetParameterHospitalsQuery,
} from "../store/api/kioskParameterApi";
import {
  useGetKiosksQuery,
  useDeleteKioskMutation,
} from "../store/api/kioskApi";

const DefinedKiosks = () => {
  const [selectedHastane, setSelectedHastane] = useState(null);
  const [selectedDepartman, setSelectedDepartman] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKiosk, setEditingKiosk] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: hospitals } = useGetParameterHospitalsQuery();

  const { data: departments } = useGetParameterDepartmentsQuery(
    { hospitalId: selectedHastane?.value },
    {
      skip: !selectedHastane,
    }
  );

  const { data: kiosks, refetch } = useGetKiosksQuery({
    hospitalId: selectedHastane?.value || "",
    departmentId: selectedDepartman?.value || "",
  });

  const [deleteKiosk, { isLoading: isDeleting }] = useDeleteKioskMutation();

  const handleModalSuccess = () => {
    refetch();
  };

  const handleDelete = async (id) => {
    if (!id) return;
    const confirmed = window.confirm("Bu kiosk silinsin mi?");
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await deleteKiosk(id).unwrap();
      await refetch();
    } catch (error) {
      console.error("Kiosk silme hatası:", error);
      alert("Silme sırasında bir hata oluştu.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <CreateKioskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingKiosk(null);
        }}
        onSuccess={handleModalSuccess}
        kiosk={editingKiosk}
      />
      <div className="p-8 bg-gray-50 min-h-full">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Tanımlı Kiosklar
            </h2>
            <p className="text-gray-600">
              Kiosk tanımlarını görüntüleyin ve yönetin
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium flex items-center gap-2 shadow-md"
          >
            <FiPlus className="text-lg" />
            Yeni Kiosk Ekle
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput
              label="Hastane"
              options={hospitals?.data?.map((hospital) => ({
                value: hospital.id,
                label: hospital.name,
              }))}
              value={selectedHastane}
              onChange={setSelectedHastane}
              placeholder="Tüm Hastaneler"
            />
            <SelectInput
              label="Departman"
              options={departments?.data?.map((department) => ({
                value: department.id,
                label: department.name,
              }))}
              value={selectedDepartman}
              onChange={setSelectedDepartman}
              placeholder="Tüm Departmanlar"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-linear-to-r from-primary to-primary-dark">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Hastane
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Departman
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Kod
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Ad
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {kiosks?.data?.length > 0 ? (
                  kiosks?.data?.map((kiosk) => (
                    <tr
                      key={kiosk.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {kiosk.hospitalName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {kiosk.departmentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="font-mono font-semibold text-primary">
                          {kiosk.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {kiosk.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            kiosk.isActive === true
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {kiosk.isActive ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            className="bg-primary hover:bg-primary-dark text-white p-2 rounded-lg transition-colors duration-200"
                            title="Düzenle"
                            onClick={() => {
                              setEditingKiosk(kiosk);
                              setIsModalOpen(true);
                            }}
                          >
                            <FiEdit2 className="text-lg" />
                          </button>
                          <button
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Sil"
                            onClick={() => handleDelete(kiosk.id)}
                            disabled={isDeleting && deletingId === kiosk.id}
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Filtre kriterlerine uygun kiosk bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DefinedKiosks;
