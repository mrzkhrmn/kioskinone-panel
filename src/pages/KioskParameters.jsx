import React, { useState, useMemo } from "react";
import { FiSave, FiTrash2 } from "react-icons/fi";
import ScopeTree from "../components/ScopeTree";
import {
  useGetScopeParametersQuery,
  useSaveParameterValueMutation,
  useRemoveOverrideMutation,
} from "../store/api/kioskParameterApi";
import { useAppDispatch } from "../store/hooks";
import { setLoading } from "../store/slices/loadingSlice";

const levelMap = {
  global: 0,
  hospital: 1,
  department: 2,
  kiosk: 3,
};

const KioskParameters = () => {
  const dispatch = useAppDispatch();
  const [selectedScope, setSelectedScope] = useState({
    level: "global",
    hospitalId: null,
    departmentId: null,
    kioskId: null,
  });
  const [overrideValues, setOverrideValues] = useState({});

  const requestParams = useMemo(() => {
    return {
      level: levelMap[selectedScope.level] || 0,
      hospitalId: selectedScope.hospitalId || null,
      departmentId: selectedScope.departmentId || null,
      kioskId: selectedScope.kioskId || null,
    };
  }, [selectedScope]);

  const {
    data: parameters,
    isLoading,
    refetch,
  } = useGetScopeParametersQuery(requestParams);

  const [saveParameterValue, { isLoading: isSaving }] =
    useSaveParameterValueMutation();
  const [removeOverride, { isLoading: isRemoving }] =
    useRemoveOverrideMutation();

  const scopeDescription = useMemo(() => {
    if (selectedScope.level === "global") {
      return "Global seçildi: Tüm hastane, tüm departman ve tüm kiosklar kapsamda.";
    }
    if (selectedScope.level === "hospital") {
      return `${
        selectedScope.hospitalName || "Hastane"
      } seçildi: Bu hastanedeki tüm departman ve kiosklar kapsamda.`;
    }
    if (selectedScope.level === "department") {
      return `${
        selectedScope.departmentName || "Departman"
      } seçildi: Bu departmandaki tüm kiosklar kapsamda.`;
    }
    if (selectedScope.level === "kiosk") {
      return `${
        selectedScope.kioskName || "Kiosk"
      } seçildi: Sadece bu kiosk kapsamda.`;
    }
    return "";
  }, [selectedScope]);

  const handleScopeSelect = (scope) => {
    setSelectedScope(scope);
    setOverrideValues({});
  };

  const handleOverrideChange = (parameterDefinitionId, value) => {
    setOverrideValues((prev) => ({
      ...prev,
      [parameterDefinitionId]: value,
    }));
  };

  const handleSave = async (param) => {
    const value =
      overrideValues[param.parameterDefinitionId] ?? param.effectiveValue ?? "";

    try {
      dispatch(setLoading(true));
      await saveParameterValue({
        parameterDefinitionId: param.parameterDefinitionId,
        level: requestParams.level,
        hospitalId: requestParams.hospitalId,
        departmentId: requestParams.departmentId,
        kioskId: requestParams.kioskId,
        value: value,
      }).unwrap();

      await refetch();
      setOverrideValues((prev) => {
        const newValues = { ...prev };
        delete newValues[param.parameterDefinitionId];
        return newValues;
      });
    } catch (error) {
      console.error("Parametre kaydetme hatası:", error);
      alert("Parametre kaydedilirken bir hata oluştu");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRemoveOverride = async (param) => {
    if (!param.hasOverrideOnThisScope) {
      return;
    }

    const confirmed = window.confirm(
      "Override değeri silinsin mi? Bu işlem geri alınamaz."
    );
    if (!confirmed) return;

    try {
      dispatch(setLoading(true));
      await removeOverride({
        parameterDefinitionId: param.parameterDefinitionId,
        level: requestParams.level,
        hospitalId: requestParams.hospitalId,
        departmentId: requestParams.departmentId,
        kioskId: requestParams.kioskId,
        value: "",
      }).unwrap();

      await refetch();
    } catch (error) {
      console.error("Override silme hatası:", error);
      alert("Override silinirken bir hata oluştu");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Kiosk Parametreleri
        </h2>
        <p className="text-gray-600">
          Kiosk parametrelerini görüntüleyin ve yönetin
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ScopeTree onScopeSelect={handleScopeSelect} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-blue-50 text-blue-800 border border-blue-100 rounded-xl px-4 py-3 text-sm">
            {scopeDescription}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Parametreler
            </h3>
            {isLoading ? (
              <div className="text-center text-gray-500 py-8">
                Yükleniyor...
              </div>
            ) : parameters?.data && parameters.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-linear-to-r from-primary to-primary-dark">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Kod
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Ad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Veri Tipi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Etkin Değer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Kaynak Seviye
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Override Değer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parameters.data.map((param) => {
                      const currentValue =
                        overrideValues[param.parameterDefinitionId] !==
                        undefined
                          ? overrideValues[param.parameterDefinitionId]
                          : param.effectiveValue || "";
                      const hasChanges =
                        overrideValues[param.parameterDefinitionId] !==
                          undefined &&
                        overrideValues[param.parameterDefinitionId] !==
                          (param.effectiveValue || "");

                      return (
                        <tr
                          key={param.parameterDefinitionId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <span className="font-mono">{param.code}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {param.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                              {param.dataType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {param.effectiveValue || (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {param.sourceLevelName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input
                              type="text"
                              value={currentValue}
                              onChange={(e) =>
                                handleOverrideChange(
                                  param.parameterDefinitionId,
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                              placeholder="Override değeri giriniz"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSave(param)}
                                disabled={isSaving || !hasChanges}
                                className="bg-primary hover:bg-primary-dark text-white p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Kaydet"
                              >
                                <FiSave className="text-lg" />
                              </button>
                              {param.hasOverrideOnThisScope && (
                                <button
                                  onClick={() => handleRemoveOverride(param)}
                                  disabled={isRemoving}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Override'ı Sil"
                                >
                                  <FiTrash2 className="text-lg" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Parametre bulunamadı.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KioskParameters;
