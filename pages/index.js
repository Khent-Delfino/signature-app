import Link from "next/link";
import { useSignatureStore } from "../store/signature";

export default function Home() {
    const signatureStore = useSignatureStore();

    return (
        <div className="max-w-[1200px] w-[90%] py-5 m-auto">
            <div className="border border-indigo-600 p-4 rounded-lg max-w-[600px]">
                {signatureStore.image ? (
                    <img src={signatureStore.image} 
                        height={signatureStore.h} 
                        width={signatureStore.w} />
                ): 'No signature yet'}
            </div>
            <div className="mt-5">
                <Link className="btn btn-primary" href="/signature"> 
                    {signatureStore.image ? 'Update Signature' : 'Add Signature'}
                </Link>
            </div>
        </div>
    )
}
