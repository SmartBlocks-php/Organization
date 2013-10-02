<?php

namespace Organization;

/**
 * @Entity @Table(name="organization_objective")
 */
class Objective extends \Model
{
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @Column(type="string")
     */
    private $name;

    /**
     * @Column(type="boolean")
     */
    private $manually_validated;

    /**
     * @ManyToOne(targetEntity="\User")
     */
    private $creator;

    /**
     * @ManyToMany(targetEntity="\Organization\Task", inversedBy="objectives")
     */
    private $tasks;

    public function __construct()
    {
        $this->name = "New Objective";
        $this->manually_validated = false;
        $this->tasks = new \Doctrine\Common\Collections\ArrayCollection();
        $this->creator = \User::current_user();
    }

    public function setCreator($creator)
    {
        $this->creator = $creator;
    }

    public function getCreator()
    {
        return $this->creator;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getName()
    {
        return $this->name;
    }

    public function addTask($task)
    {
        $this->tasks[] = $task;
    }

    public function setTasks($tasks)
    {
        $this->tasks = $tasks;
    }

    public function deleteTasks()
    {
        $this->tasks = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getTasks()
    {
        return $this->tasks;
    }

    public function setManuallyValidated($manually_validated)
    {
        $this->manually_validated = $manually_validated;
    }

    public function getManuallyValidated()
    {
        return $this->manually_validated;
    }

    public function toArray($full = true)
    {
        $myArray = array();
        $myArray["id"] = $this->id;
        $myArray["name"] = $this->name;
        $myArray["manually_validated"] = $this->manually_validated;
        $myArray["creator"] = $this->creator;
        $myArray["tasks"] = array();
        if ($full)
        {
            foreach ($this->tasks as $task)
            {
                $myArray["tasks"][] = $task->toArray(true, true, true, true, true, false);
            }
        }

        return $myArray;
    }
}