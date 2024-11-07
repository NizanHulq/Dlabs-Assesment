import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const EditModal = ({ user, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Set default values when the component mounts or user data changes
  useEffect(() => {
    if (user) {
      setValue("nama", user.nama);
      setValue("email", user.email);
      setValue("umur", user.umur);
      setValue("status", user.status);
    }
  }, [user, setValue]);

  if (!user) return null;

  return (
    <div className="modal">
      <div className="modal-content card">
        <h2>Edit Data Pengguna</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="edit-user-form">
          <div className="form-group">
            <label>Nama Lengkap *</label>
            <input
              {...register("nama", { required: "Nama tidak boleh kosong" })}
            />
            {errors.nama && (
              <span className="error-message">{errors.nama.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              {...register("email", { required: "Email tidak boleh kosong" })}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Umur *</label>
            <input
              type="number"
              {...register("umur", {
                required: "Umur harus berupa angka positif",
                min: 1,
              })}
            />
            {errors.umur && (
              <span className="error-message">{errors.umur.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Status Keanggotaan *</label>
            <select
              {...register("status", { required: "Status harus dipilih" })}
            >
              <option value="">Pilih Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
            {errors.status && (
              <span className="error-message">{errors.status.message}</span>
            )}
          </div>

          <div className="modal-buttons">
            <button className="submit-btn" type="submit">Simpan Perubahan</button>
            <button className="cancel-btn" type="button" onClick={onClose}>
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
