// hooks/useEnrollment.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/stores/useAuth";

export function useEnrollment(activityId?: string) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);

    useEffect(() => {
        let ignore = false;
        async function run() {
            if (!activityId || !user?.id) { setEnrolled(false); setLoading(false); return; }
            const { data, error } = await supabase.rpc("is_user_enrolled", { p_activity_id: activityId });
            if (!ignore) {
                if (error) {
                    console.error("is_user_enrolled error", error);
                    setEnrolled(false);
                } else {
                    setEnrolled(Boolean(data));
                }
                setLoading(false);
            }
        }
        run();
        return () => { ignore = true; };
    }, [activityId, user?.id]);

    return { enrolled, loading, setEnrolled };
}
