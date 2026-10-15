import { authRepositoryProvider, login, type LoginForm } from "@/features/auth/auth";
import { CustomFilledButton, PasswordFormField, TextFormField, useTheme } from "@/features/shared/shared";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "@/features/shared/shared";
import { useState } from "react";
import { Clock, Fingerprint, Lock, Mail, Moon, ShieldCheck, Sun } from "lucide-react";
import type { AppDispatch } from "@/config/config";

const LOGO_URL = "https://legumexappsapi-storage.s3.us-east-1.amazonaws.com/resources/LOGO_LX_V2.png";

const FEATURES = [
    { icon: <Fingerprint size={20} />, text: "Registro biométrico" },
    { icon: <Clock size={20} />, text: "Marcajes en tiempo real" },
    { icon: <ShieldCheck size={20} />, text: "Acceso seguro por roles" },
];

function BrandLogo() {
    const [failed, setFailed] = useState(false);

    return (
        <div className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,.25),0_0_0_4px_rgba(255,255,255,.12)]">
            {failed ? (
                <span className="text-[22px] font-extrabold tracking-tighter text-blue-900">LX</span>
            ) : (
                <img src={LOGO_URL} alt="Legumex" onError={() => setFailed(true)} className="h-12 w-12 object-contain" />
            )}
        </div>
    );
}

export function Login() {
    const { error } = useNotification();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const dispatch = useDispatch<AppDispatch>();

    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue,
        setFocus
    } = useForm<LoginForm>();

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: LoginForm) => authRepositoryProvider.login(payload),
        onSuccess: (user) => {
            dispatch(login(user))
        },
        onError: (err) => {
            error(err.message);
            setValue('password', '');
            setTimeout(() => setFocus('password'), 0);
        }
    });

    const onSubmit = (data: LoginForm) => mutate(data);

    return (
        <div className="grid min-h-screen grid-cols-1 bg-linear-to-br from-slate-900 via-blue-900 to-slate-800 text-gray-900 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:bg-none lg:bg-white dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 dark:text-gray-100 lg:dark:bg-gray-900">

            {/* Hero (desktop) */}
            <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-linear-to-br from-slate-900 via-blue-900 to-slate-800 p-12 text-white lg:flex">
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-slate-900/90 via-blue-900/80 to-slate-800/90" />
                <Fingerprint
                    size={640}
                    strokeWidth={0.5}
                    className="pointer-events-none absolute -bottom-45 -right-40 text-white opacity-[.06]"
                />
                <div className="pointer-events-none absolute -left-30 -top-30 h-105 w-105 rounded-full bg-emerald-500/20 blur-[64px]" />

                <div className="pointer-events-none relative flex items-center gap-4">
                    <BrandLogo />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[22px] font-bold tracking-tight">Biométricos</span>
                        <span className="text-[13px] text-blue-200/75">Plataforma Biométricos</span>
                    </div>
                </div>

                <div className="pointer-events-none relative flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                        <p className="max-w-140 text-[38px] font-bold leading-[1.15] tracking-tight text-balance xl:text-5xl">
                            Control de asistencia biométrico
                        </p>
                        <p className="max-w-md text-lg leading-relaxed text-pretty text-blue-100/80">
                            Gestione marcajes, personal y reportes desde un solo lugar.
                        </p>
                    </div>

                    <ul className="flex flex-col gap-3.5">
                        {FEATURES.map(({ icon, text }) => (
                            <li key={text} className="flex items-center gap-3">
                                <span className="flex rounded-lg bg-white/10 p-2 ring-1 ring-inset ring-white/15">{icon}</span>
                                <span className="text-[15px] text-white/90">{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="pointer-events-none relative text-sm text-blue-200/60">Legumex · Sistema interno</p>
            </section>

            {/* Formulario */}
            <section className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-4 pb-8 pt-18 sm:px-6 sm:py-12 lg:p-12">
                <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
                    title={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
                    className="absolute right-5 top-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border border-white/20 bg-white/10 text-white transition hover:bg-white/20 lg:border-gray-200 lg:bg-white lg:text-gray-500 lg:hover:bg-gray-100 lg:hover:text-gray-900 lg:dark:border-gray-700 lg:dark:bg-gray-800 lg:dark:text-gray-400 lg:dark:hover:bg-gray-700 lg:dark:hover:text-gray-100"
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Marca (móvil / tablet) */}
                <div className="flex flex-col items-center gap-3 text-center text-white lg:hidden">
                    <BrandLogo />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xl font-bold">Biométricos</span>
                        <span className="text-xs text-blue-200/70">Plataforma Biométricos</span>
                    </div>
                </div>

                <div className="flex w-full max-w-md animate-fade-up flex-col gap-8 rounded-2xl bg-white p-6 shadow-2xl motion-reduce:animate-none sm:p-8 dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-white/10 lg:max-w-sm lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:dark:bg-transparent lg:dark:ring-0">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Bienvenido</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ingrese sus credenciales para continuar</p>
                    </div>

                    <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit(onSubmit)}>
                        <TextFormField<LoginForm>
                            name="email"
                            label="Correo Electrónico"
                            placeholder="nombre@legumex.com"
                            type="email"
                            autoComplete="email"
                            icon={<Mail size={18} />}
                            readOnly={isPending}
                            errorMessage={errors.email?.message}
                            register={register}
                            validation={{
                                required: 'El correo es requerido',
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Ingrese un correo válido' }
                            }}
                        />

                        <PasswordFormField<LoginForm>
                            name="password"
                            label="Contraseña"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            icon={<Lock size={18} />}
                            readOnly={isPending}
                            errorMessage={errors.password?.message}
                            register={register}
                            validation={{ required: 'La contraseña es requerida' }}
                        />

                        <CustomFilledButton
                            label={isPending ? 'Iniciando sesión…' : 'Iniciar Sesión'}
                            type="submit"
                            disabled={isPending}
                            loading={false}
                            fullWitdh
                            className="mt-1 rounded-lg! py-3!"
                            icon={isPending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : undefined}
                        />
                    </form>

                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                        ¿Problemas para ingresar? Contacte al departamento de TI.
                    </p>
                </div>
            </section>
        </div>
    )
}
