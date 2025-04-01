using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace project_alpha_0._1
{
    public partial class Menu : Form
    {
        public Menu()
        {
            InitializeComponent();
            Start();
            
            button1.Click += userEdit;
            button2.Click += parkingGarageEdit;
            button3.Click += reservationEdit;
            button4.Click += logOut;
        }

        public void Start()
        {
            this.FormBorderStyle = FormBorderStyle.None;

            this.BackColor = Color.FromArgb(93, 135, 54);
            label1.BackColor = Color.FromArgb(93, 135, 54);

            label1.Text = "Menü";
            button1.Text = "Felhasználók kezelése";
            button2.Text = "Parkolóházak kezelése";
            button3.Text = "Foglalások kezelése";
            button4.Text = "Kijelentkezés";

            int label1Middle = label1.Width / 2;
            label1.Left = this.Width / 2 - label1Middle;

            int btn1Middle = button1.Width / 2;
            int btn2Middle = button2.Width / 2;
            int btn3Middle = button3.Width / 2;
            int btn4Middle = button4.Width / 2;

            button1.Left = this.Width / 2 - btn1Middle;
            button2.Left = this.Width / 2 - btn2Middle;
            button3.Left = this.Width / 2 - btn3Middle;
            button4.Left = this.Width / 2 - btn4Middle;

            int pbMiddle = pictureBox1.Width / 2;
            pictureBox1.Left = this.Width / 2 - pbMiddle;
        }

        public void logOut(object s, EventArgs e)
        {
            const string message = "Biztosan ki akarsz jelentkezni?";
            const string caption = "Kijelentkezés";
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.YesNo,
                                         MessageBoxIcon.Question);

            if (result == DialogResult.Yes)
            {
                this.Hide();
                signIn signin = new signIn();
                signin.ShowDialog();
                
            }
        }

        public void userEdit(object s, EventArgs e)
        {
            this.Hide();
            userEdit useredit = new userEdit();
            useredit.Show();
            
        }

        public void parkingGarageEdit(object s, EventArgs e)
        {
            this.Hide();
            parkinGarageEdit parkingarageEdit = new parkinGarageEdit();
            parkingarageEdit.ShowDialog();
            
        }

        public void reservationEdit(object s, EventArgs e)
        {
            this.Hide();
            reservationEdit reservationedit = new reservationEdit();
            reservationedit.ShowDialog();
            
        }
    }
}
