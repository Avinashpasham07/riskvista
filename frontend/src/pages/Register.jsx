import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import GlassCard from '../components/GlassCard';

const Register = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        industryCategory: 'SaaS',
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const result = await register(
            formData.email,
            formData.password,
            formData.companyName,
            formData.industryCategory
        );

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setIsSubmitting(false);
    };

    return (
        <GlassCard>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">Onboard Entity</h1>
                <p className="text-zinc-400 text-sm mt-2">Register a new tenant isolation container.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        className="glass-input"
                        autoComplete="off"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">Industry</label>
                    <select
                        name="industryCategory"
                        value={formData.industryCategory}
                        onChange={handleChange}
                        className="glass-input appearance-none"
                    >
                        <option value="SaaS">SaaS</option>
                        <option value="Retail">Retail</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="space-y-1 !mt-6">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">Admin Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="glass-input"
                        autoComplete="off"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">Secure Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="glass-input"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full primary-btn mt-6 flex justify-center items-center disabled:opacity-50"
                >
                    {isSubmitting ? 'Provisioning...' : 'Create Tenant'}
                </button>
            </form>

            <p className="text-center text-zinc-400 text-sm mt-6">
                Already registered? <Link to="/login" className="text-brand-blue hover:text-blue-400 font-medium transition-colors">Sign in</Link>
            </p>
        </GlassCard>
    );
};

export default Register;
