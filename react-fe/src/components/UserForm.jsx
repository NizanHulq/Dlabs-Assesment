import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";

// Definisikan skema validasi Zod
const userSchema = z.object({
  nama: z.string().min(1, { message: "Nama tidak boleh kosong" }),
  email: z
    .string()
    .email("Format email tidak valid")
    .min(1, "Email tidak boleh kosong"),
  umur: z
    .number({ invalid_type_error: "Umur harus berupa angka" })
    .int()
    .positive("Umur harus berupa angka positif")
    .min(1, "Umur minimal 1")
    .max(120, "Umur maksimal 120"),
  status: z.enum(["Aktif", "Tidak Aktif"], {
    errorMap: () => ({ message: "Status harus dipilih" }),
  }),
});

const UserForm = ({ onSubmit }) => {
  // Integrasi dengan zodResolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nama: "",
      email: "",
      umur: "",
      status: "",
    },
  });

  // Fungsi untuk submit data
  const onFormSubmit = (data) => {
    const newUser = {
      id: uuidv4(), 
      ...data, 
    };
    onSubmit(newUser); 
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="add-user-form">
      <div className="form-group">
        <label>Nama Lengkap *</label>
        <input {...register("nama")} />
        {errors.nama && (
          <span className="error-message">{errors.nama.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Email *</label>
        <input type="email" {...register("email")} />
        {errors.email && (
          <span className="error-message">{errors.email.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Umur *</label>
        <input type="number" {...register("umur", { valueAsNumber: true })} />
        {errors.umur && (
          <span className="error-message">{errors.umur.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Status Keanggotaan *</label>
        <select {...register("status")}>
          <option value="">Pilih Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Tidak Aktif">Tidak Aktif</option>
        </select>
        {errors.status && (
          <span className="error-message">{errors.status.message}</span>
        )}
      </div>

      <button type="submit" className="submit-btn">
        Tambah Pengguna
      </button>
    </form>
  );
};

export default UserForm;
