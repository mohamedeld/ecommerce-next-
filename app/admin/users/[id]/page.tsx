import { getUserById } from "@/actions/user.action";
import UpdateUserForm from "@/components/user/update-user-form";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata:Metadata = {
  title:"Update user"
}

const UpdateUserPage = async ({params}:{
  params:Promise<{
    id:string;
  }>
}) => {
  const {id} = await params;
  const user = await getUserById(id);
  if(!user){
    redirect("/admin/users");
  }
  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">Update user</h1>
      <UpdateUserForm user={user} userId={user?.id}/>
    </div>
  )
}

export default UpdateUserPage