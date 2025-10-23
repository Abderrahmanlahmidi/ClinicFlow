# ** authSlice.js  JWT**

```js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../services/api"

// Register async action
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", userData)
    
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur inconnue")
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default authSlice.reducer
```

---

# ** RegisterForm.jsx**

```jsx
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { registerUser } from "../authSlice"

export default function RegisterForm() {
  const dispatch = useDispatch()
  const { loading, error, user } = useSelector((state) => state.auth)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    dispatch(registerUser(data))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 max-w-sm mx-auto mt-10">
      <input
        type="text"
        placeholder="Nom"
        {...register("name", { required: "Le nom est obligatoire" })}
      />
      {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}

      <input
        type="email"
        placeholder="Email"
        {...register("email", {
          required: "L'email est obligatoire",
          pattern: { value: /^\S+@\S+$/i, message: "Email invalide" },
        })}
      />
      {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

      <input
        type="password"
        placeholder="Mot de passe"
        {...register("password", { required: "Le mot de passe est obligatoire" })}
      />
      {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Inscription..." : "S'inscrire"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {user && <p style={{ color: "green" }}>Bienvenue {user.name}</p>}
    </form>
  )
}
```

---

# ** Register.jsx**

```jsx
import RegisterForm from "../components/RegisterForm"

export default function Register() {
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Page d'inscription</h1>
      <RegisterForm />
    </div>
  )
}
```

---

# ** services/api.js**

```js
import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
})

export default api
```


---

# ** store.js**

```js
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})
```

---

# ** main.jsx + App.jsx**

```jsx
// main.jsx
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { Provider } from "react-redux"
import { store } from "./app/store.js"
import { BrowserRouter } from "react-router-dom"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
```

```jsx
// App.jsx
import { Routes, Route } from "react-router-dom"
import Register from "./features/auth/pages/Register"

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}
```


