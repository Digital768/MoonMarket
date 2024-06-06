import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef } from "react";
import { Form, useNavigation  } from "react-router-dom";
import { updateUsername, changePassword } from "@/api/user";

export async function action({ request }, token) {
  let formData = await request.formData();
  let intent = formData.get("intent");
  if (intent === "username") {
    const newUsername = updateUsername(formData.get("username"), token);
    return newUsername;
  }
  if (intent === "password") {
    let oldPassword = formData.get("password");
    let newPassword = formData.get("new-password");
    const changedPassword = changePassword(oldPassword, newPassword, token);
    return changedPassword;
  }
}

export function TabsDemo({ username }) {
  const passwordFromRef = useRef(null);
  const navigation = useNavigation();
  const { state } = navigation;

    useEffect(()=>{
    if (state==="idle" && passwordFromRef.current){
      passwordFromRef.current.reset();
    }
  },[state, passwordFromRef])


  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2 bg-zinc-700">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <Form method="patch">
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" defaultValue={username} />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="blackText"
                type="submit"
                name="intent"
                value="username"
              >
                Save changes
              </Button>
            </CardFooter>
          </Form>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here.
            </CardDescription>
          </CardHeader>
          <Form method="patch" ref={passwordFromRef}>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" name="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" name="new-password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="blackText" name="intent" value="password">
                Save changes
              </Button>
            </CardFooter>
          </Form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
