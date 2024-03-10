import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf } from "zod";

const createUserSchema = object({
    name: string({
        required_error: "Name is required",
    }),
    password: string({
        required_error: "Password is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
    passwordConfirmation: string({
        required_error: "passwordConfirmation is required",
    }),
    email: string({
        required_error: "Email is required",
    })
        .email("Not a valid email"),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
});

type CreateUserInput = TypeOf<typeof createUserSchema>;

function RegisterPage() {
    const router = useRouter();
    const [registerError, setRegisterError] = useState(null);
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<CreateUserInput>({
        resolver: zodResolver(createUserSchema),
    });

    async function onSubmit(values: CreateUserInput) {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`,
                values
            );
            router.push("/")
        } catch (e: any) {
            setRegisterError(e.message);
        }
    }

    return (
        <>
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-2xl m-4 ">
                <p className="text-black text-center underline">Node Mart Register Form</p>
                <p className="text-red-500">{registerError}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="jane.doe@example.com"
                            {...register("email")}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                        />
                        <p className="text-red-500">{errors.email?.message}</p>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-1">Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Jane Doe"
                            {...register("name")}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                        />
                        <p className="text-red-500">{errors.name?.message}</p>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="*********"
                            {...register("password")}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                        />
                        <p className="text-red-500">{errors.password?.message}</p>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="passwordConfirmation" className="block mb-1">Confirm Password</label>
                        <input
                            id="passwordConfirmation"
                            type="password"
                            placeholder="*********"
                            {...register("passwordConfirmation")}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                        />
                        <p className="text-red-500">{errors.passwordConfirmation?.message}</p>
                </div>

                    <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">SUBMIT</button>
            </form>
            </div>
        </>

    );
}

export default RegisterPage;