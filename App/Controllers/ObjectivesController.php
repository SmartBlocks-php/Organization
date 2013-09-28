<?php

namespace Organization;

class ObjectivesController extends \Controller
{
    public function security_check()
    {
        if (!\User::logged_in())
        {
            $this->redirect("/");
        }
    }

    public function index()
    {
        $this->security_check();
        $this->render = false;
        header("Content-Type: application/json");
        $response = array();
        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();

        $qb->select("o")
            ->from("Organization\\Objective", "o")
            ->where("o.creator = :user")
            ->setParameter("user", \User::current_user());

        $models = $qb->getQuery()->getResult();
        foreach ($models as $model)
        {
            $response[] = $model->toArray();
        }
        echo json_encode($response);
    }

    public function show($params = array())
    {
        $this->security_check();
        $this->render = false;
        header("Content-Type: application/json");

        $model = Objective::find($params['id']);

        if (is_object($model) && $model->getCreator() == \User::current_user())
        {
            echo json_encode($model->toArray());
        }
        else
        {
            echo json_encode(array("error"));
        }
    }

    public function create()
    {
        $this->security_check();

        $this->render = false;
        header("Content-Type: application/json");

        $model = new Objective();
        $data = $this->getRequestData();
        if (isset($data["name"]))
            $model->setName($data["name"]);

        if (isset($data["tasks"]) && is_array($data["tasks"]))
        {
            foreach ($data["tasks"] as $datatask)
            {
                $task = Task::find($datatask["id"]);
                if ($task && is_object($task))
                {
                    $model->addTask($task);
                }
            }
        }

        $model->save();

        if (is_object($model))
        {
            echo json_encode($model->toArray());
        }
        else
        {
            echo json_encode(array("error"));
        }
    }

    public function update($params = array())
    {
        $this->security_check();

        $this->render = false;
        header("Content-Type: application/json");

        $model = Objective::find($params["id"]);
        $data = $this->getRequestData();
        $model->setName($data["name"]);
        $model->setManuallyValidated($data["manuallyValidated"]);

        if (isset($data["tasks"]) && is_array($data["tasks"]))
        {
            foreach ($data["tasks"] as $datatask)
            {
                $task = Task::find($datatask["id"]);
                if ($task && is_object($task))
                {
                    $model->addTask($task);
                }
            }
        }

        $model->save();

        if (is_object($model))
        {
            echo json_encode($model->toArray());
        }
        else
        {
            echo json_encode(array("error"));
        }
    }

    public function destroy($params = array())
    {
        $this->render = false;
        header("Content-Type: application/json");

        $model = Objective::find($params["id"]);
        if (is_object($model))
        {
            $model->delete();
            echo json_encode(array("success"));
        }
        else
        {
            echo json_encode(array("error"));
        }
    }
}