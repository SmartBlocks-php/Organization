<?php

namespace Organization;

class ObjectivesController extends \Controller
{
    public function security_check()
    {
        if (!\User::logged_in())
        {
            $this->redirect("/Meetings/Schemas/error");
        }
    }

    public function index()
    {

    }
    public function create()
    {

    }
    public function show($params = array())
    {

    }
    public function update($params = array())
    {

    }
    public function destroy($params = array())
    {

    }
}