import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";


const createUserSchema = object({
    name: string().nonempty({
        message: "Name is required",
    }),
    password: string()
        .min(6, "Password too short - should be 6 chars minimum")
        .nonempty({
            message: "Password is required",
        }),
    passwordConfirmation: string().nonempty({
        message: "passwordConfirmation is required",
    }),
    email: string({
        required_error: "Email is required",
    })
        .email("Not a valid email")
        .nonempty({
            message: "Password is required",
        }),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
});



function RegisterPage() {

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: zodResolver(createUserSchema),
    });

    function onSubmit(values: any) {
        console.log({ values })
    }

    console.log({ errors });

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='form-element'>
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder='test@gmail.com' {...register("email")} className='border-2' />
                </div>
                <button>submit</button>
            </form>
        </>
    )
}

export default RegisterPage;